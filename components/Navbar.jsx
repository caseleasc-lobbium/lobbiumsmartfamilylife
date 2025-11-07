export default function Navbar() {
  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-4">
      <h1 className="text-xl font-bold text-gray-800">Lobbium Admin</h1>
      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/admin/login";
        }}
        className="text-red-600 hover:text-red-800 font-semibold"
      >
        Logout
      </button>
    </header>
  );
}