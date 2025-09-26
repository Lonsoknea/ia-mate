'use strict';

// Mock the OpenAI service to avoid real API calls
jest.mock('../services/openaiService', () => ({
  callOpenAI: jest.fn().mockResolvedValue(
    JSON.stringify({
      entities: ["Product", "User", "Order"],
      roles: ["Buyer", "Seller", "Admin"],
      features: ["Catalog", "Cart", "Reviews"],
      pages: ["Home", "Shop", "Product", "Cart", "Checkout"],
      suggested_pages: ["FAQ", "Contact"],
      recommended_ia: { type: "Tree", reason: "Clear hierarchical navigation" },
      outline: "Home > Shop > Product > Cart > Checkout"
    })
  ),
}));

const request = require('supertest');
const app = require('../app');

describe('POST /api/analyze', () => {
  it('returns 200 and analysis.entities exists', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ idea: 'mobile app to sell handmade shoes with reviews' })
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('analysis');
    expect(res.body.analysis).toHaveProperty('entities');
    expect(Array.isArray(res.body.analysis.entities)).toBe(true);
  });
});
