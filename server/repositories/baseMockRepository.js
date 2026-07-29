const { generateId } = require('../utils/idGenerator');

class BaseMockRepository {
  constructor(name, initialData = []) {
    this.name = name;
    this.data = [...initialData];
  }

  async find(filterFn = null) {
    if (!filterFn) return [...this.data];
    return this.data.filter(filterFn);
  }

  async findById(id) {
    const item = this.data.find(row => String(row.id) === String(id));
    return item ? { ...item } : null;
  }

  async create(itemData) {
    const newRecord = {
      id: itemData.id || generateId(this.name.substring(0, 3)),
      createdAt: itemData.createdAt || new Date().toISOString(),
      ...itemData
    };
    this.data.unshift(newRecord);
    return { ...newRecord };
  }

  async updateById(id, updateData) {
    const index = this.data.findIndex(row => String(row.id) === String(id));
    if (index === -1) return null;
    
    this.data[index] = {
      ...this.data[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.data[index] };
  }

  async deleteById(id) {
    const index = this.data.findIndex(row => String(row.id) === String(id));
    if (index === -1) return false;
    this.data.splice(index, 1);
    return true;
  }

  async count(filterFn = null) {
    if (!filterFn) return this.data.length;
    return this.data.filter(filterFn).length;
  }

  async paginate({ page = 1, limit = 10, search = '', filterFn = null, sortField = 'createdAt', sortOrder = 'desc' } = {}) {
    let result = [...this.data];

    if (filterFn && typeof filterFn === 'function') {
      result = result.filter(filterFn);
    }

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
}

module.exports = BaseMockRepository;
