import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDroneStore, type Drone } from "core";

export default function DroneManagement() {
  const initDroneSystem = useDroneStore((s) => s.initDroneSystem);
  const drones = useDroneStore((s) => s.drones);
  const isLoading = useDroneStore((s) => s.isLoading);
  const navigate = useNavigate();

  // Polling config
  const POLL_INTERVAL_MS = 3000;
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // initial load
    initDroneSystem().catch((e) => console.error(e));

    // start polling to keep drone states updated
    pollingRef.current = setInterval(async () => {
      if (isFetchingRef.current) return;
      try {
        isFetchingRef.current = true;
        await initDroneSystem();
      } catch (err) {
        console.error("Polling initDroneSystem failed:", err);
      } finally {
        isFetchingRef.current = false;
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [initDroneSystem]);

  function statusLabel(status: Drone["status"]) {
    switch (status) {
      case "idle":
        return "Sẵn sàng";
      case "moving_to_store":
        return "Đang tới quán";
      case "at_store":
        return "Tại quán";
      case "delivering":
        return "Đang giao";
      case "returning":
        return "Trở về";
      case "charging":
        return "Đang sạc";
      default:
        return status;
    }
  }

  function statusColor(status: Drone["status"]) {
    switch (status) {
      case "delivering":
        return "#F72D57";
      case "moving_to_store":
        return "#06b6d4";
      case "idle":
        return "#10b981";
      case "at_store":
        return "#f59e0b";
      case "returning":
        return "#6366f1";
      case "charging":
        return "#f97316";
      default:
        return "#374151";
    }
  }

  function handleViewOnMap(d: Drone) {
    const path = `/admin/drone-tracking/${d.id}${d.currentOrderId ? `/${d.currentOrderId}` : ""}`;
    navigate(path);
  }

  const deliveringCount = useMemo(() => drones.filter((d) => d.status === "delivering").length, [drones]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Quản lý Drone (Admin)</h2>

      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ fontSize: 14, color: "#6b7280" }}>Tổng drone: {drones.length}</div>
        <div style={{ fontSize: 14, color: "#16a34a", marginLeft: 12 }}>Đang giao: {deliveringCount}</div>
      </div>

      {isLoading && <div>Đang tải...</div>}

      {!isLoading && (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: 8 }}>ID</th>
                <th style={{ padding: 8 }}>Model</th>
                <th style={{ padding: 8 }}>Trạng thái</th>
                <th style={{ padding: 8 }}>Pin</th>
                <th style={{ padding: 8 }}>Vị trí hiện tại</th>
                <th style={{ padding: 8 }}>Đơn</th>
                <th style={{ padding: 8 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {drones.map((d) => (
                <tr key={d.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 8, verticalAlign: "middle" }}>{d.id}</td>
                  <td style={{ padding: 8, verticalAlign: "middle" }}>{d.model}</td>
                  <td style={{ padding: 8, verticalAlign: "middle" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          background: statusColor(d.status),
                          display: "inline-block",
                        }}
                      />
                      <span>{statusLabel(d.status)}</span>
                    </span>
                  </td>
                  <td style={{ padding: 8, verticalAlign: "middle" }}>{d.battery}%</td>
                  <td style={{ padding: 8, verticalAlign: "middle" }}>
                    {d.currentLat != null && d.currentLng != null
                      ? `${d.currentLat.toFixed(5)}, ${d.currentLng.toFixed(5)}`
                      : "-"}
                  </td>
                  <td style={{ padding: 8, verticalAlign: "middle" }}>{d.currentOrderId ?? "-"}</td>
                  <td style={{ padding: 8, verticalAlign: "middle" }}>
                    <button
                      onClick={() => handleViewOnMap(d)}
                      style={{
                        padding: "6px 12px",
                        background: "#2c3e50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      Xem trên bản đồ
                    </button>
                  </td>
                </tr>
              ))}
              {drones.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 12, textAlign: "center" }}>
                    Không có drone.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}