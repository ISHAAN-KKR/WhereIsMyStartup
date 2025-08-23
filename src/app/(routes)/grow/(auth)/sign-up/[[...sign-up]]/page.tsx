import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <>
   
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className=" p-6 max-w-md  max-md:mx-auto">
          <SignUp/>
          </div>
          <div className="max-md:mt-8">
            <img src="https://readymadeui.com/login-image.webp" className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover" alt="Dining Experience" />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}