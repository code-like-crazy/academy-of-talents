type Props = {
  params: {
    id: Promise<string>;
  };
};

const page = async (props: Props) => {
  const { id } = await props.params;

  return <div>{id}</div>;
};

export default page;
