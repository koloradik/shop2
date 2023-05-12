import { Button, LoadingOverlay, TextInput } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useState } from "react";

type LoginProps = {
  closeModal: () => void;
};

const Login = (props: LoginProps) => {
  const [email, setEmail] = useState("");

  const [isLoading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);

    await signIn("email", { email, redirect: false });

    props.closeModal();
    setLoading(false);
  };

  return (
    <div className="flex flex-col space-y-4 justify-center m-3">
      <LoadingOverlay visible={isLoading} overlayBlur={3} />
      <TextInput
        withAsterisk
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-autofocus
        autoFocus
      />
      <Button disabled={!email} onClick={login}>
        Bойти
      </Button>
    </div>
  );
};

export default Login;
