import useAuth from "@/store/auth";
import {
  Button,
  LoadingOverlay,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

type LoginProps = {
  closeModal: () => void;
};

const Login = (props: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAuth();

  const [visible, { toggle }] = useDisclosure(false);

  const [isLoading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);

    fetch(`/api/login`, {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.user) {
          auth.login(res.user);
          props.closeModal();

          setLoading(false);
        }
      });
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
      <PasswordInput
        withAsterisk
        label="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        visible={visible}
        onVisibilityChange={toggle}
      />
      <Button disabled={!email || !password} onClick={login}>
        Bойти
      </Button>
    </div>
  );
};

export default Login;
