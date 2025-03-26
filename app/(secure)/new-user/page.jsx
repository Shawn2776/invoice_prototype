import PageOne from "@/components/forms/new-user/PageOne";

const NewUserPage = () => {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <h1 className="text-2xl max-w-sm mx-auto">NewUserPage</h1>
      <div className="max-w-sm mx-auto">
        <PageOne />
      </div>
    </div>
  );
};

export default NewUserPage;
