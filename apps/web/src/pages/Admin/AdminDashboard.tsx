
export default function AdminDashboard() {
  return (
    <div>
      <h1>Tổng quan hệ thống</h1>
      <p>Chào mừng quản trị viên quay trở lại.</p>
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 200 }}>
              <h3>Tổng User</h3>
              <p style={{ fontSize: 24, fontWeight: 'bold' }}>1,204</p>
          </div>
          <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 200 }}>
              <h3>Đơn hôm nay</h3>
              <p style={{ fontSize: 24, fontWeight: 'bold', color: 'green' }}>45</p>
          </div>
      </div>
    </div>
  );
}