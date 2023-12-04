import RegistrationForm from "@/components/registrationForm";

export default function Register() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-3">
      <div className="w-4/5">
        <h1 className="text-2xl">Create Account</h1>
      </div>
      <RegistrationForm />
    </main>
  )
}
