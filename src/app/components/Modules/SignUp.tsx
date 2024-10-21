import { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../Context/GlobalContext';
import { BaseDialog } from '../ui/BaseDialog';
import { z } from 'zod';
import { LoadingButton } from '@/components/ui/loading-button';
import { userServices } from '@/services/supplier';
import { AxiosError } from 'axios';
import { useActiveAccount } from 'thirdweb/react';

const signUpSchema = z.object({
  nickname: z
    .string()
    .min(3, { message: 'Nick name must be at least 3 characters long' })
    .max(20, { message: 'Nick name must be at most 20 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export function SignUpModal() {
  const { user, fetchUser } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nickname: '', email: '' });
  const [errors, setErrors] = useState<{
    nickname?: string;
    email?: string;
    axios?: string;
  }>({});
  const [step, setStep] = useState(1);
  const activeAccount = useActiveAccount();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user && user.wallet && !user.username) {
      setOpen(true);
    }
  }, [user]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      setErrors({});
      signUpSchema.parse(formData);
      const data = new FormData();
      data.append('username', formData.nickname);
      data.append('email', formData.email);
      await userServices.updateProfile(data);
      await fetchUser();
      setLoading(false);
      setStep(2);
    } catch (error) {
      setLoading(false);
      if (error instanceof z.ZodError) {
        const newErrors: { nickname?: string; email?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'nickname') {
            newErrors.nickname = err.message;
          }
          if (err.path[0] === 'email') {
            newErrors.email = err.message;
          }
        });
        setErrors(newErrors);
      }

      if (error instanceof AxiosError) {
        try {
          const {
            response: {
              data: { path, message },
            },
          } = error;
          if (path) {
            setErrors({ axios: message });
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <BaseDialog
      isOpen={open}
      onClose={(val) => {
        setOpen(val);
      }}
      className="w-[494px] h-[347px] mx-auto overflow-y-auto overflow-x-hidden bg-[#161616] rounded-[20px] shadow"
    >
      {step === 1 && (
        <div className="items-center justify-center">
          <div className="pr-[129px] pb-[62px] left-[29.50px] top-[31px] absolute justify-start items-center inline-flex">
            <div className="self-stretch justify-start items-center gap-3.5 inline-flex">
              <div className="text-center text-white text-3xl font-extrabold font-['Manrope'] capitalize">
                Enter your Nickname
              </div>
            </div>
          </div>

          <div className="w-[436px] h-[52px] px-4 py-[15px] left-[29px] top-[104px] absolute bg-[#232323] rounded-xl justify-start items-center gap-[13px] inline-flex">
            <div className="w-[26px] h-[26px] px-[5.42px] py-[3.25px] justify-center items-center flex">
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.3332 7.58333C17.3332 9.97657 15.3931 11.9167 12.9998 11.9167C10.6066 11.9167 8.6665 9.97657 8.6665 7.58333C8.6665 5.1901 10.6066 3.25 12.9998 3.25C15.3931 3.25 17.3332 5.1901 17.3332 7.58333Z"
                  stroke="#DDF247"
                  strokeWidth="2.16667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.9998 15.1667C8.81168 15.1667 5.4165 18.5618 5.4165 22.75H20.5832C20.5832 18.5618 17.188 15.1667 12.9998 15.1667Z"
                  stroke="#DDF247"
                  strokeWidth="2.16667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Enter nickname..."
              className="grow shrink basis-0 text-white/50 text-sm font-normal font-['Azeret Mono'] leading-snug focus:outline-none"
            />
          </div>

          <div className="w-[436px] h-[52px] px-4 py-[15px] left-[29px] top-[171px] absolute bg-[#232323] rounded-xl justify-start items-center gap-[13px] inline-flex">
            <div className="w-[26px] h-[26px] px-[3.25px] py-[5.42px] justify-center items-center flex">
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.25 8.66602L11.7982 14.3648C12.5259 14.85 13.4741 14.85 14.2019 14.3648L22.75 8.66602M5.41667 20.5827H20.5833C21.78 20.5827 22.75 19.6126 22.75 18.416V7.58268C22.75 6.38607 21.78 5.41602 20.5833 5.41602H5.41667C4.22005 5.41602 3.25 6.38607 3.25 7.58268V18.416C3.25 19.6126 4.22005 20.5827 5.41667 20.5827Z"
                  stroke="#DDF247"
                  strokeWidth="2.16667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email..."
              className="grow shrink basis-0 text-white/50 text-sm font-normal font-['Azeret Mono'] leading-snug focus:outline-none"
            />
          </div>

          <div className="w-[454px] left-[29px] top-[235px] absolute text-[#ff0000] text-sm font-normal font-['Azeret Mono'] leading-snug">
            {(errors.nickname || errors.email) && (
              <p className="text-red-500">*All fields are required.</p>
            )}
            {errors.axios && <p className="text-red-500">{errors.axios}</p>}
          </div>

          <LoadingButton
            loading={loading}
            className="w-[436px] h-[50px] p-2.5 left-[29px] top-[274px] absolute bg-[#ddf247] rounded-[14px] justify-center items-center gap-2.5 inline-flex"
            onClick={handleSubmit}
          >
            <span className="text-[#161616] text-base font-extrabold font-['Manrope'] capitalize">
              Next
            </span>
            <div className="w-[18px] h-[18px] relative">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.375 14.625L14.625 3.375M14.625 3.375H6.1875M14.625 3.375V11.8125"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </LoadingButton>
        </div>
      )}

      {step === 2 && (
        <div className="items-center justify-center">
          <div className="w-[438px] h-[236px] left-[28px] top-[57px] absolute">
            <div className="left-[144px] top-[151px] absolute text-center text-white text-3xl font-extrabold font-['Manrope'] capitalize">
              Congrats!
            </div>
            <div className="left-[158px] top-0 absolute text-center text-white text-[121px] font-extrabold font-['Manrope'] capitalize">
              🎉
            </div>
            <div className="w-[438px] left-0 top-[214px] absolute text-center text-white/50 text-sm font-normal font-['Azeret Mono'] leading-snug">
              You have successfully created an account.
            </div>
          </div>
        </div>
      )}
    </BaseDialog>
  );
}
