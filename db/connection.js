// Mock database connection
const mockDb = {
    query: async (sql, params) => {
        console.log('Mock DB Query:', sql, params);
        // Return empty results for now
        return [[]];
    }
};

module.exports = mockDb; 