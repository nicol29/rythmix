import CompleteAccountForm from "@/components/completeAccountForm";


export default async function CompleteAccount() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-3">
      <div className="w-4/5 mt-8 max-w-sm">
        <h1 className="text-2xl">Complete Account</h1>
      </div>
      <CompleteAccountForm />
    </main>
  )
}