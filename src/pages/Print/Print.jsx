export default function Print() {
  return (
    <div className="coa-print">
      <h1>Chart of Accounts</h1>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Account Code</th>
            <th>Account Name</th>
            <th>Type</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1000</td>
            <td>Cash</td>
            <td>Asset</td>
            <td>10,000,000</td>
          </tr>
        </tbody>
      </table>
      <div>
        <button>Print</button>
        <button>Cancel</button>
      </div>
    </div>
  );
}
