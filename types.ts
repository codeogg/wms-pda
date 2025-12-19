
export interface Warehouse {
  id: string;
  name: string;
}

export interface SKUItem {
  sku: string;
  qty: number;
  name?: string;
}

export interface InboundItem extends SKUItem {
  specification: string;
  totalQty: number;
  packedQty: number;
}

export interface InboundOrder {
  orderNo: string;
  warehouseId: string;
  status: 'pending' | 'processing' | 'completed';
  items: InboundItem[];
  isRedDash?: boolean; // True for "Red Dash Outbound" handled in packing
}

export interface OutboundOrder {
  orderNo: string;
  customer: string;
  status: 'pending' | 'analyzing' | 'queued' | 'shipped';
  items: SKUItem[];
  isRedDash?: boolean; // True for "Red Dash Inbound" handled in outbound
}

export interface PalletStock {
  palletCode: string;
  items: SKUItem[];
  location: string;
}

export interface PalletDetail {
  sku: string;
  qty: number;
}

export interface Pallet {
  code: string;
  orderNo: string;
  details: PalletDetail[];
}

export interface DockPort {
  id: string;
  name: string;
  status: 'empty' | 'occupied';
  palletCode?: string;
}

export interface Cart {
  id: string;
  status: 'idle' | 'busy' | 'charging' | 'error';
  battery: number;
  currentTask?: string;
}

export interface QueueTask {
  id: string;
  type: 'outbound' | 'return';
  palletCode: string;
  source: string;
  target?: string;
  timestamp: string;
}

export type AppMode = 'packing' | 'inbound' | 'outbound' | 'home' | 'monitor';
