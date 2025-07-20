import Navbar from "../../../components/nav-bar/NavBar";

function TaskScreen() {
  return (
    <div>
      <Navbar
        user={{ name: "Test Michael", email: "testermichael@gmail.com" }}
        onLogout={() => {}}
      />
    </div>
  );
}

export default TaskScreen;
