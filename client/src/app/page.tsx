import LoginForm from "./(auth)/login/page";
import SelectRole from "./(auth)/select-role/page";

export default function Home() {
  return (
    <>
      <LoginForm />
      <SelectRole/>
    </>
  );
}
