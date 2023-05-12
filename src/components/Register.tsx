import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  Alert,
  Button,
  LoadingOverlay,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { useState } from "react";

type RegisterProps = {
  closeModal: () => void;
};

const Register = (props: RegisterProps) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [visible, { toggle }] = useDisclosure(false);

  const [isLoading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const register = () => {
    setLoading(true);

    axios
      .post(`/api/register`, {
        name: name,
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);

          setLoading(false);
        } else if (res.data.user) {
          // auth.login({
          //   id: res.data.user.id,
          //   avatar: res.data.user.avatar,
          //   email: res.data.user.email,
          //   name: res.data.user.name,
          //   role: res.data.user.role,
          //   wishlist: res.data.user.wishlist,
          // });
          props.closeModal();

          setLoading(false);
        }
      });
  };

  return (
    <div className="flex flex-col space-y-4 m-3">
      <LoadingOverlay visible={isLoading} overlayBlur={3} />
      <TextInput
        withAsterisk
        label="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        data-autofocus
        autoFocus
      />
      <TextInput
        withAsterisk
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        withAsterisk
        label="Пароль"
        visible={visible}
        onVisibilityChange={toggle}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordInput
        withAsterisk
        visible={visible}
        onVisibilityChange={toggle}
        label="Подтвердите пароль"
        value={cpassword}
        onChange={(e) => setCpassword(e.target.value)}
      />

      {error ? (
        <Alert icon={<ExclamationTriangleIcon />} title="Ошибка" color="red">
          {error}
        </Alert>
      ) : null}

      <Button
        disabled={
          !cpassword || !password || !email || !name || password !== cpassword
        }
        onClick={register}
      >
        3арегистрироватся
      </Button>
    </div>
  );
};

export default Register;
