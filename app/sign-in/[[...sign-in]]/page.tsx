import SignInForm from "@/components/forms/sign-in-form";

const SignInPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-linear-to-b from-[#f6f6f8] to-gray-200 min-h-screen">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
