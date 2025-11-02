import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';

describe('Use Case Diagrams - Extension Points', () => {
  it('should parse use case with single extension point', () => {
    const dsl = `
      diagram "Online Shopping" {
        shape checkout as @ellipseWide label:"Checkout" extensionPoints:["Payment Failed"]
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(1);
    
    const useCase = result.diagram?.nodes[0];
    expect(useCase?.label).toBe('Checkout');
    expect(useCase?.extensionPoints).toEqual(['Payment Failed']);
  });

  it('should parse use case with multiple extension points', () => {
    const dsl = `
      diagram "Banking System" {
        shape login as @ellipse label:"Login" extensionPoints:["Invalid Credentials", "Account Locked", "Session Timeout"]
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const useCase = result.diagram?.nodes[0];
    expect(useCase?.extensionPoints).toEqual([
      'Invalid Credentials',
      'Account Locked',
      'Session Timeout',
    ]);
  });

  it('should parse multiple use cases with extension points', () => {
    const dsl = `
      diagram "E-Commerce" {
        shape browse as @ellipseWide label:"Browse Products"
        shape checkout as @ellipseWide label:"Checkout" extensionPoints:["Payment Failed", "Insufficient Inventory"]
        shape payment as @ellipseWide label:"Process Payment" extensionPoints:["Card Declined", "Timeout"]
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(3);
    
    const browse = result.diagram?.nodes[0];
    expect(browse?.extensionPoints).toBeUndefined();
    
    const checkout = result.diagram?.nodes[1];
    expect(checkout?.extensionPoints).toEqual([
      'Payment Failed',
      'Insufficient Inventory',
    ]);
    
    const payment = result.diagram?.nodes[2];
    expect(payment?.extensionPoints).toEqual(['Card Declined', 'Timeout']);
  });

  it('should parse use case diagram with extend relationship and extension points', () => {
    const dsl = `
      diagram "ATM System" {
        shape withdraw as @ellipseWide label:"Withdraw Cash" extensionPoints:["Insufficient Funds", "Daily Limit Exceeded"]
        shape handleInsufficient as @ellipseWide label:"Handle Insufficient Funds"
        shape handleLimit as @ellipseWide label:"Handle Daily Limit"
        
        handleInsufficient -> withdraw
        handleLimit -> withdraw
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const withdraw = result.diagram?.nodes[0];
    expect(withdraw?.extensionPoints).toEqual([
      'Insufficient Funds',
      'Daily Limit Exceeded',
    ]);
    expect(result.diagram?.edges).toHaveLength(2);
  });

  it('should parse extension points with descriptive text', () => {
    const dsl = `
      diagram "Flight Booking" {
        shape bookFlight as @ellipseWide label:"Book Flight" extensionPoints:["No Seats Available: after seat selection", "Payment Failed: during payment processing"]
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const useCase = result.diagram?.nodes[0];
    expect(useCase?.extensionPoints).toEqual([
      'No Seats Available: after seat selection',
      'Payment Failed: during payment processing',
    ]);
  });

  it('should handle empty extension points array', () => {
    const dsl = `
      diagram "Test" {
        shape test as @ellipse label:"Test Use Case" extensionPoints:[]
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const useCase = result.diagram?.nodes[0];
    expect(useCase?.extensionPoints).toEqual([]);
  });

  it('should parse use case with extension points and other properties', () => {
    const dsl = `
      diagram "Hotel Reservation" {
        shape reserve as @ellipseWide label:"Reserve Room" tooltip:"User books a hotel room" extensionPoints:["Room Not Available", "Invalid Dates"]
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const useCase = result.diagram?.nodes[0];
    expect(useCase?.label).toBe('Reserve Room');
    expect(useCase?.tooltip).toBe('User books a hotel room');
    expect(useCase?.extensionPoints).toEqual([
      'Room Not Available',
      'Invalid Dates',
    ]);
  });

  it('should parse extension points with special characters', () => {
    const dsl = `
      diagram "System" {
        shape process as @ellipse label:"Process Data" extensionPoints:["Error: data.validation != passed", "Timeout: t > 30s"]
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const useCase = result.diagram?.nodes[0];
    expect(useCase?.extensionPoints).toEqual([
      'Error: data.validation != passed',
      'Timeout: t > 30s',
    ]);
  });

  it('should parse complex use case diagram with actors and extension points', () => {
    const dsl = `
      diagram "Restaurant System" {
        shape customer as @actor label:"Customer"
        shape waiter as @actor label:"Waiter"
        shape orderFood as @ellipseWide label:"Order Food" extensionPoints:["Item Unavailable", "Special Requests"]
        shape pay as @ellipseWide label:"Pay Bill" extensionPoints:["Split Check", "Apply Discount"]
        
        customer -> orderFood
        customer -> pay
        waiter -> orderFood
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(4);
    
    const orderFood = result.diagram?.nodes.find((n) => n.id === 'orderFood');
    expect(orderFood?.extensionPoints).toEqual([
      'Item Unavailable',
      'Special Requests',
    ]);
    
    const pay = result.diagram?.nodes.find((n) => n.id === 'pay');
    expect(pay?.extensionPoints).toEqual(['Split Check', 'Apply Discount']);
  });

  it('should handle use cases without extension points alongside those with them', () => {
    const dsl = `
      diagram "Library System" {
        shape search as @ellipseWide label:"Search Books"
        shape borrow as @ellipseWide label:"Borrow Book" extensionPoints:["Book Unavailable", "Overdue Books"]
        shape returnBook as @ellipseWide label:"Return Book"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(3);
    
    expect(result.diagram?.nodes[0].extensionPoints).toBeUndefined();
    expect(result.diagram?.nodes[1].extensionPoints).toEqual([
      'Book Unavailable',
      'Overdue Books',
    ]);
    expect(result.diagram?.nodes[2].extensionPoints).toBeUndefined();
  });
});
