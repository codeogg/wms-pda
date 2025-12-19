
import { InboundOrder, OutboundOrder, PalletStock, Warehouse, DockPort, Cart, QueueTask } from './types';

export const M_WAREHOUSE_ID = 'WH-M';

export const WAREHOUSES: Warehouse[] = [
  { id: 'WH-M', name: 'M 待入库仓库' },
  { id: 'WH-A', name: 'A 标准仓库' },
];

export const MOCK_DOCK_PORTS: DockPort[] = [
  { id: 'PORT-01', name: '1号接驳口', status: 'occupied', palletCode: 'PL-A-001' },
  { id: 'PORT-02', name: '2号接驳口', status: 'empty' },
  { id: 'PORT-03', name: '3号接驳口', status: 'occupied', palletCode: 'PL-B-105' },
  { id: 'PORT-04', name: '4号接驳口', status: 'empty' },
];

export const MOCK_CARTS: Cart[] = [
  { id: 'AGV-01', status: 'busy', battery: 85, currentTask: 'Moving PL-A-001' },
  { id: 'AGV-02', status: 'idle', battery: 92 },
  { id: 'AGV-03', status: 'charging', battery: 15 },
];

export const INITIAL_QUEUE: QueueTask[] = [
  { id: 'T001', type: 'outbound', palletCode: 'PL-A-002', source: 'A-01-02', target: 'PORT-02', timestamp: '14:20:05' },
  { id: 'T002', type: 'outbound', palletCode: 'PL-C-302', source: 'C-05-02', target: 'PORT-04', timestamp: '14:22:10' },
];

export const MOCK_INBOUND_ORDERS: InboundOrder[] = [
  {
    orderNo: 'IN202310240001',
    warehouseId: 'WH-M',
    status: 'pending',
    items: [
      { sku: 'APPLE-14', name: 'iPhone 14 Pro', specification: '256GB / Space Black', totalQty: 100, packedQty: 20, qty: 0 },
      { sku: 'SAM-S23', name: 'Samsung S23 Ultra', specification: '512GB / Phantom Black', totalQty: 50, packedQty: 45, qty: 0 },
      { sku: 'XIAOMI-13', name: 'Xiaomi 13 Pro', specification: '12GB+256GB', totalQty: 80, packedQty: 0, qty: 0 },
    ]
  },
  {
    orderNo: 'RE-OUT-2023001',
    warehouseId: 'WH-M',
    status: 'pending',
    isRedDash: true, // Red Dash Outbound -> Treated as Inbound Packing
    items: [
      { sku: 'APPLE-14', name: 'iPhone 14 Pro', specification: 'Returns', totalQty: 5, packedQty: 0, qty: 0 },
    ]
  },
  {
    orderNo: 'IN202310240002',
    warehouseId: 'WH-M',
    status: 'pending',
    items: [
      { sku: 'MAC-AIR-M2', name: 'MacBook Air M2', specification: '13-inch / 8GB / 256GB', totalQty: 30, packedQty: 10, qty: 0 },
      { sku: 'IPAD-PRO-11', name: 'iPad Pro 11-inch', specification: 'WiFi / 128GB', totalQty: 60, packedQty: 30, qty: 0 },
    ]
  }
];

export const MOCK_OUTBOUND_ORDERS: OutboundOrder[] = [
  {
    orderNo: 'OUT20231101001',
    customer: '顺丰物流北京分拣中心',
    status: 'pending',
    items: [
      { sku: 'APPLE-14', qty: 15, name: 'iPhone 14 Pro' },
      { sku: 'SAM-S23', qty: 5, name: 'Samsung S23 Ultra' }
    ]
  },
  {
    orderNo: 'RE-IN-99901',
    customer: '供应商退货-红冲',
    status: 'pending',
    isRedDash: true, // Red Dash Inbound -> Treated as Outbound
    items: [
      { sku: 'XIAOMI-13', qty: 20, name: 'Xiaomi 13 Pro' }
    ]
  },
  {
    orderNo: 'OUT20231101002',
    customer: '京东商城华东仓',
    status: 'pending',
    items: [
      { sku: 'MAC-AIR-M2', qty: 2, name: 'MacBook Air M2' },
      { sku: 'XIAOMI-13', qty: 10, name: 'Xiaomi 13 Pro' }
    ]
  }
];

export const MOCK_PALLET_STOCK: PalletStock[] = [
  {
    palletCode: 'PL-A-001',
    location: 'A-01-01',
    items: [{ sku: 'APPLE-14', qty: 10 }, { sku: 'SAM-S23', qty: 5 }]
  },
  {
    palletCode: 'PL-A-002',
    location: 'A-01-02',
    items: [{ sku: 'APPLE-14', qty: 20 }]
  },
  {
    palletCode: 'PL-B-105',
    location: 'B-02-11',
    items: [{ sku: 'MAC-AIR-M2', qty: 10 }]
  },
  {
    palletCode: 'PL-C-302',
    location: 'C-05-02',
    items: [{ sku: 'XIAOMI-13', qty: 50 }]
  },
  {
    palletCode: 'PL-D-009',
    location: 'D-01-09',
    items: [{ sku: 'IPAD-PRO-11', qty: 25 }]
  }
];
