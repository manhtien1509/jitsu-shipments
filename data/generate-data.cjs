const fs = require("fs");

const statusList = ["OPEN", "IN_TRANSIT", "DELIVERED"];
const statuses = statusList.map((status) => ({ id: status }));

const clients = [
  "Sony",
  "Samsung",
  "DHL",
  "CargoTrans",
  "ShipCo",
  "Logix",
  "Oceanic",
];
const warehouses = ["EWR", "LAX", "JFK", "SFO", "SEA"];

const baseDate = new Date();
const minLat = 32.55,
  maxLat = 33.05;
const minLng = -97.4,
  maxLng = -96.5;

const shipments = [];
for (let i = 1; i <= 100; i++) {
  const arrival = new Date(baseDate);
  arrival.setDate(arrival.getDate() - Math.floor(Math.random() * 10));

  const eta = new Date(arrival);
  eta.setHours(eta.getHours() + Math.floor(Math.random() * 48));

  shipments.push({
    id: `shp_${String(i).padStart(3, "0")}`,
    client_name: clients[i % clients.length],
    label: `${warehouses[i % warehouses.length]}-581-2505${20 + (i % 10)}-${i}`,
    status: statusList[i % statusList.length],
    arrival_date: arrival.toISOString(),
    delivery_by_date: new Date(arrival.getTime() + 2 * 86400000).toISOString(),
    eta: eta.toISOString(),
    warehouse_id: "581",
    assignment_id: null,
    lat: Math.random() * (maxLat - minLat) + minLat,
    lng: Math.random() * (maxLng - minLng) + minLng,
  });
}

const assignments = [];
const assignmentCount = 12;
const emptyCount = 3;

for (let i = 1; i <= assignmentCount; i++) {
  const isEmpty = i > assignmentCount - emptyCount;
  const status = isEmpty
    ? "OPEN"
    : i <= Math.floor((assignmentCount - emptyCount) / 2)
      ? "OPEN"
      : "COMPLETED";

  assignments.push({
    id: `as_${String(i).padStart(3, "0")}`,
    label: `${warehouses[i % warehouses.length]}-${100 + i}`,
    status,
    clients: [],
    shipment_count: 0,
  });
}

const openAssignments = assignments.filter(
  (a) =>
    a.status === "OPEN" &&
    assignments.indexOf(a) < assignmentCount - emptyCount,
);
const completedAssignments = assignments.filter(
  (a) => a.status === "COMPLETED",
);

const bucketByStatus = {
  IN_TRANSIT: openAssignments,
  DELIVERED: completedAssignments,
};

shipments.forEach((s, idx) => {
  if (s.status === "OPEN") return;
  const bucket = bucketByStatus[s.status];
  if (!bucket || bucket.length === 0) return;
  const target = bucket[idx % bucket.length];
  s.assignment_id = target.id;
});

for (const a of assignments) {
  const related = shipments.filter((s) => s.assignment_id === a.id);
  a.shipment_count = related.length;
  a.clients = Array.from(new Set(related.map((s) => s.client_name)));
}

const result = { statuses, shipments, assignments };
fs.writeFileSync("data/shipments.json", JSON.stringify(result, null, 2));
console.log(
  `Generated: ${shipments.length} shipments, ${assignments.length} assignments ` +
    `(${assignments.filter((a) => a.shipment_count === 0).length} empty).`,
);
