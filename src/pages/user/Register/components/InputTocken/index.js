// import React, { FC, useEffect, useRef, useState } from "react";

// interface Props {}

// let currentOTPIndex:number = 0;
// const InputToken: FC<Props> = (props): JSX.Element => {
//   const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
//   const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleOnChangToken = ({target,}: React.ChangeEvent<HTMLInputElement>):void => {
//     const {value} = target;
//     const newOTP: string[] = [...otp];
//     newOTP[currentOTPIndex] = value.substring(value.length -1);

//     if(!value) setActiveOTPIndex(currentOTPIndex - 1)
//     else  setActiveOTPIndex(currentOTPIndex + 1);

//     setOtp(newOTP)
//   }

//   const handleOnKeyDown = ({key}:React.KeyboardEvent<HTMLInputElement>,index:number) => {
//     currentOTPIndex = index
//     if(key === 'Backspace') setActiveOTPIndex(currentOTPIndex - 1)
//   }

//   useEffect(()=> {
//     inputRef.current?.focus()
//   },[activeOTPIndex])

//   return (
//     <div className="flex items-center justify-center h-screen space-x-2">
//       {otp.map((_, index) => {
//         return (
//           <React.Fragment key={index}>
//             <input
//             ref={index === activeOTPIndex ? inputRef: null}
//               type="number"
//               className="w-12 h-12 text-xl font-semibold text-center text-gray-400 transition bg-transparent border-2 border-gray-400 rounded outline-none spin-button-none focus:border-gray-700 focus:text-gray-700"
//                 onChange={handleOnChangToken}
//                 onKeyDown={(e)=>handleOnKeyDown(e,index)}
//                 value={otp[index]}
//             />
//             {index === otp.length - 1 ? null : (
//               <span className="w-2 py-0.5 bg-gray-400" />
//             )}
//           </React.Fragment>
//         );
//       })}
//     </div>
//   );
// };

// export default InputToken;

import React, { useEffect, useRef, useState } from 'react';
import { getActiveApi } from './callApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import './InputCustom.css';
import { notify } from '~/utils/common';

let currentOTPIndex = 0;

const InputToken = (props) => {
    //State
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [activeOTPIndex, setActiveOTPIndex] = useState(0);

    const inputRef = useRef(null);

    const { mutate: mutationGetActive } = useMutation({
        mutationFn: getActiveApi,
        onSuccess: (data) => {
            if ((data && data?.status === 200) || data?.status === '200') {
                return notify(data?.data, 'success');
            }
            return notify(data?.message, 'error');
        },
    });

    // xử lý nhập iunput token
    const handleOnChangToken = (e) => {
        const { value } = e.target;
        const newOTP = [...otp];
        newOTP[currentOTPIndex] = value.substring(value.length - 1);

        if (!value) {
            setActiveOTPIndex(currentOTPIndex - 1);
        } else {
            setActiveOTPIndex(currentOTPIndex + 1);
        }
        // const token = newOTP.reduce((acc, curr) => acc + curr, '');

        setOtp(newOTP);
    };

    // xử lý tự động focus input item
    const handleOnKeyDown = (e, index) => {
        currentOTPIndex = index;
        if (e.key === 'Backspace') {
            setActiveOTPIndex(currentOTPIndex - 1);
        }
    };

    // xử lý ấn submit confirm button
    const handleSubmitToken = () => {
        // console.log('token', otp.join(''));
        mutationGetActive();
    };

    // tự động focus input item
    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOTPIndex]);

    return (
        <div
            id="input_token"
            className="flex flex-col items-center max-w-xl p-10 m-auto bg-white shadow-2xl rounded-3xl"
        >
            <h1 className="text-2xl font-semibold text-gray-100 ">Account Verification</h1>
            <div className="px-10 text-center">
                <p className="font-semibold text-gray-500">
                    Enter the verification token you received on your email into the input field below.
                </p>
            </div>
            {/* render input item */}
            <div className="flex flex-wrap">
                {otp.map((_, index) => (
                    <div key={index}>
                        <input
                            ref={index === activeOTPIndex ? inputRef : null}
                            type="number"
                            className="input_item spin-button-none"
                            onChange={handleOnChangToken}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            value={otp[index]}
                        />
                        {index !== otp.length - 1 && <span className="w-2 py-0.5 bg-gray-400" />}
                    </div>
                ))}
            </div>
            {/* check khi nhập full mã otp mới hiển thị button submit */}
            {otp.every((value) => value !== '') ? (
                <button onClick={() => handleSubmitToken()} className="px-5 py-2 text-white bg-blue-100 rounded-lg">
                    Confirm
                </button>
            ) : null}
        </div>
    );
};

export default InputToken;
