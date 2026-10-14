# Receiving Workflow (fictional)

## 1. Trigger

A warehouse associate scans a supplier shipment against an open Purchase Order.

## 2. Steps

1. Associate opens the Purchase Order in the Receiving module.
2. Associate manually enters quantities received per line item from the paper/PDF packing slip.
3. System updates the Stock Ledger for each received line.
4. If received quantity differs from ordered quantity, system flags a discrepancy for a supervisor.
5. Supervisor reviews flagged discrepancies and approves or escalates.

## 3. Business rules

- A Purchase Order cannot be marked "Closed" while discrepancies remain unresolved.
- Partial receipts are allowed; the PO stays "Open — Partially Received" until fully received or
  manually closed by a supervisor.

## 4. Known limitation

Packing-slip data entry is fully manual; no OCR or structured import exists today.
