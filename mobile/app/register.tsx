import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useFormik } from 'formik';
import { AlertCircleIcon } from 'lucide-react-native';
import { View } from 'react-native';
import * as Yup from 'yup';

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { NoteAssistLogo } from '@/constants/Images';
import { APP_BG_COLOR } from '@/constants/Variables';
import { register } from '@/services/AuthService';
import { useAuthStore } from '@/store/authStore';

WebBrowser.maybeCompleteAuthSession();

const Register = () => {
  const router = useRouter();
  const { setAuthInfo } = useAuthStore();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      firstname: Yup.string().required('First name is required'),
      lastname: Yup.string().required('Last name is required'),
      email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      register(values)
        .then((data) => setAuthInfo(data))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <View
      className="h-full w-full justify-center items-center"
      style={{ backgroundColor: APP_BG_COLOR }}
    >
      <VStack space="md" className="justify-center items-center">
        <Image
          source={NoteAssistLogo}
          style={{
            height: 80,
            width: 150,
          }}
        ></Image>
        <Heading size="3xl" className="text-background-800">
          Register
        </Heading>
      </VStack>
      <VStack space="lg" className="p-4 w-full">
        <FormControl
          isInvalid={!!errors.firstname && touched.firstname}
          isDisabled={isSubmitting}
        >
          <FormControlLabel>
            <FormControlLabelText>First Name</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="text"
              placeholder="Enter first name"
              value={values.firstname}
              onChangeText={handleChange('firstname')}
              onBlur={handleBlur('firstname')}
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon size="xs" as={AlertCircleIcon} />
            <FormControlErrorText size="xs">
              {errors.firstname}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          isInvalid={!!errors.lastname && touched.lastname}
          isDisabled={isSubmitting}
        >
          <FormControlLabel>
            <FormControlLabelText>Last Name</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="text"
              placeholder="Enter last name"
              value={values.lastname}
              onChangeText={handleChange('lastname')}
              onBlur={handleBlur('lastname')}
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon size="xs" as={AlertCircleIcon} />
            <FormControlErrorText size="xs">
              {errors.lastname}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          isInvalid={!!errors.email && touched.email}
          isDisabled={isSubmitting}
        >
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="text"
              placeholder="Enter email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon size="xs" as={AlertCircleIcon} />
            <FormControlErrorText size="xs">
              {errors.email}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          isInvalid={!!errors.password && touched.password}
          isDisabled={isSubmitting}
        >
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="password"
              placeholder="Enter password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon size="xs" as={AlertCircleIcon} />
            <FormControlErrorText size="xs">
              {errors.password}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <View>
          <Button
            className="rounded-full"
            size="lg"
            variant="solid"
            action="primary"
            onPress={() => handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ?
              <ButtonSpinner />
            : <ButtonText>Register</ButtonText>}
          </Button>
          <Button
            size="md"
            variant="link"
            action="primary"
            onPress={() => router.push('/login')}
            disabled={isSubmitting}
          >
            <ButtonText>Login</ButtonText>
          </Button>
        </View>
      </VStack>
    </View>
  );
};

export default Register;
