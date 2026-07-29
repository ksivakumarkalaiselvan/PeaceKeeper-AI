const googleSheetsClient = require('../config/googleSheets');
const { generateId } = require('../utils/idGenerator');
const logger = require('../utils/logger');

class SheetRepository {
  constructor(sheetName, initialSeedData = [], cacheTTLMs = 60000) {
    this.sheetName = sheetName;
    this.initialSeedData = [...initialSeedData];
    this.cacheTTLMs = cacheTTLMs;
    this.cachedData = [...initialSeedData]; // Initialize with seed data for instant responsiveness
    this.lastFetchTime = 0;
    this.writeMutex = Promise.resolve();
  }

  async _refreshCache(force = false) {
    const now = Date.now();
    if (!force && this.cachedData.length > 0 && (now - this.lastFetchTime < this.cacheTTLMs)) {
      return this.cachedData;
    }

    try {
      let data = await googleSheetsClient.readSheet(this.sheetName);

      if ((!data || data.length === 0) && this.initialSeedData.length > 0) {
        data = [...this.initialSeedData];
      }

      const normalizedData = (data || []).map(row => {
        const item = { ...row };
        if (!item.id && item.user_id) item.id = item.user_id;
        if (!item.id) item.id = generateId(this.sheetName.substring(0, 3));
        return item;
      });

      this.cachedData = normalizedData.length > 0 ? normalizedData : [...this.initialSeedData];
      this.lastFetchTime = now;
      return this.cachedData;
    } catch (err) {
      return this.cachedData || [...this.initialSeedData];
    }
  }

  async find(filterFn = null) {
    const allData = await this._refreshCache();
    if (!filterFn) return [...allData];
    return allData.filter(filterFn);
  }

  async findById(id) {
    const allData = await this._refreshCache();
    const item = allData.find(row => String(row.id) === String(id) || String(row.user_id) === String(id));
    return item ? { ...item } : null;
  }

  async create(itemData) {
    return this._enqueueWrite(async () => {
      const newRecord = {
        id: itemData.id || generateId(this.sheetName.substring(0, 3)),
        createdAt: itemData.createdAt || new Date().toISOString(),
        ...itemData
      };

      // Optimistic cache update for instant response
      this.cachedData.unshift(newRecord);
      this.lastFetchTime = Date.now();

      // Async persistence to Google Sheets
      googleSheetsClient.createRecord(this.sheetName, newRecord).catch(err => {
        logger.warn(`[Background Sheet Sync Notice]: ${err.message}`);
      });

      return { ...newRecord };
    });
  }

  async updateById(id, updateData) {
    return this._enqueueWrite(async () => {
      const allData = await this._refreshCache();
      const existing = allData.find(row => String(row.id) === String(id) || String(row.user_id) === String(id));
      if (!existing) return null;

      const merged = {
        ...existing,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      const index = allData.findIndex(row => String(row.id) === String(id) || String(row.user_id) === String(id));
      if (index !== -1) {
        allData[index] = merged;
      }
      this.lastFetchTime = Date.now();

      googleSheetsClient.updateRecord(this.sheetName, merged).catch(err => {
        logger.warn(`[Background Sheet Sync Notice]: ${err.message}`);
      });

      return { ...merged };
    });
  }

  async deleteById(id) {
    return this._enqueueWrite(async () => {
      if (this.cachedData) {
        const index = this.cachedData.findIndex(row => String(row.id) === String(id) || String(row.user_id) === String(id));
        if (index !== -1) {
          this.cachedData.splice(index, 1);
        }
      }
      this.lastFetchTime = Date.now();

      googleSheetsClient.deleteRecord(this.sheetName, id).catch(err => {
        logger.warn(`[Background Sheet Sync Notice]: ${err.message}`);
      });

      return true;
    });
  }

  async count(filterFn = null) {
    const allData = await this._refreshCache();
    if (!filterFn) return allData.length;
    return allData.filter(filterFn).length;
  }

  async paginate({ page = 1, limit = 10, search = '', filterFn = null, sortField = 'createdAt', sortOrder = 'desc' } = {}) {
    let result = await this.find(filterFn);

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item => {
        return Object.values(item).some(val => 
          val && String(val).toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * limit;
    const paginatedItems = result.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      pagination: {
        total,
        page: currentPage,
        limit,
        totalPages
      }
    };
  }

  _enqueueWrite(writeFn) {
    this.writeMutex = this.writeMutex.then(writeFn).catch(err => {
      logger.error(`[SheetRepository Mutex Error - ${this.sheetName}]:`, err.message);
      throw err;
    });
    return this.writeMutex;
  }
}

module.exports = SheetRepository;
