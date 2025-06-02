import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TooltipButton.css';

const TooltipButton: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const plusVariants = {
    checked: {
      rotate: 45,
      scale: 0.95,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        times: [0, 0.2, 0.55, 0.8, 1],
        rotate: [0, 60, 35, 48, 45],
        scale: [1, 0.93, 0.97, 0.94, 0.95],
      },
    },
    unchecked: {
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        times: [0, 0.2, 0.55, 0.8, 1],
        rotate: [45, -15, 10, -3, 0],
      },
    },
  };

  const tooltipVariants = {
    checked: {
      width: 190,
      height: 70,
      y: -90,
      opacity: 1,
      scale: [1, 1.1, 0.9, 1.05, 1],
      scaleY: [1, 0.9, 1.1, 0.95, 1],
      transition: {
        width: { duration: 0.15, ease: 'easeIn' },
        height: { duration: 0.15, ease: 'easeIn' },
        y: { duration: 0.15, ease: 'easeIn' },
        opacity: { duration: 0.15, ease: 'easeIn' },
        scale: { duration: 1, ease: 'easeOut', times: [0, 0.1, 0.3, 0.5, 1] },
        scaleY: { duration: 1, ease: 'easeOut', times: [0, 0.1, 0.3, 0.5, 1] },
        delay: 0.15,
      },
    },
    unchecked: {
      width: 90,
      height: 75,
      y: 0,
      opacity: 0,
      transition: { duration: 0.15, ease: 'easeIn' },
    },
  };

  const shapesVariants = {
    checked: {
      scale: [0, 1, 1.1],
      opacity: [0, 1, 0],
      transition: {
        duration: 1.2,
        ease: 'easeOut',
        times: [0, 0.4, 1],
      },
    },
    unchecked: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  const shapeTransforms = Array.from({ length: 9 }, (_, i) => ({
    x: (Math.random() * 50 - 25),
    y: (Math.random() * 50 - 25),
    rotate: 40 * (i + 1),
    transition: { duration: 1.2, ease: 'easeOut', delay: 0.1 * i },
  }));

  return (
    <div className="min-h-screen bg-[#E8EBF3] flex flex-col justify-center items-center font-poppins text-base">
      <div className="relative w-[90px] h-[90px] rounded-full flex justify-center items-center">
        <input
          type="checkbox"
          className="absolute w-full h-full rounded-full cursor-pointer z-10 opacity-0"
          checked={isChecked}
          onChange={handleToggle}
        />
        <motion.div
          className="relative w-[90px] h-[90px] bg-[#62ABFF] rounded-full shadow-[0_10px_30px_rgba(65,72,86,0.05)] flex justify-center items-center z-[3]"
          variants={plusVariants}
          animate={isChecked ? 'checked' : 'unchecked'}
        >
          <div className="absolute w-1 h-7 bg-white rounded" />
          <div className="absolute w-7 h-1 bg-white rounded" />
        </motion.div>
        <AnimatePresence>
          <motion.div
            className="absolute w-[90px] h-[75px] bg-white rounded-[70px] shadow-[0_10px_30px_rgba(65,72,86,0.05)] z-[2] flex justify-around items-center px-[15px] after:content-[''] after:absolute after:w-5 after:h-5 after:bg-white after:rounded after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:z-0"
            variants={tooltipVariants}
            initial="unchecked"
            animate={isChecked ? 'checked' : 'unchecked'}
          >
            <svg className="w-full h-[26px] flex justify-around items-center cursor-pointer">
              <use
                xlinkHref="#icon-01"
                className="icon icon-01 fill-none stroke-[#414856] stroke-2 stroke-linecap-round stroke-linejoin-round opacity-40 transition-opacity duration-300 hover:opacity-100"
              />
            </svg>
            <svg className="w-full h-[26px] flex justify-around items-center cursor-pointer">
              <use
                xlinkHref="#icon-02"
                className="icon icon-02 fill-none stroke-[#414856] stroke-2 stroke-linecap-round stroke-linejoin-round opacity-40 transition-opacity duration-300 hover:opacity-100"
              />
            </svg>
            <svg className="w-full h-[26px] flex justify-around items-center cursor-pointer">
              <use
                xlinkHref="#icon-03"
                className="icon icon-03 fill-none stroke-[#414856] stroke-2 stroke-linecap-round stroke-linejoin-round opacity-40 transition-opacity duration-300 hover:opacity-100"
              />
            </svg>
          </motion.div>
        </AnimatePresence>
        <motion.svg
          className="absolute w-[150px] h-[150px] z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          variants={shapesVariants}
          initial="unchecked"
          animate={isChecked ? 'checked' : 'unchecked'}
        >
          <motion.use
            xlinkHref="#shape-01"
            className="shape shape-01 fill-none stroke-[var(--shape-color-03)] stroke-3 stroke-linecap-round stroke-linejoin-round"
            animate={isChecked ? shapeTransforms[0] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.use
            xlinkHref="#shape-02"
            className="shape shape-02 fill-none stroke-[var(--shape-color-02)] stroke-3 stroke-linecap-round stroke-linejoin-round"
            animate={isChecked ? shapeTransforms[1] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.use
            xlinkHref="#shape-03"
            className="shape shape-03 fill-none stroke-[var(--shape-color-01)] stroke-3 stroke-linecap-round stroke-linejoin-round"
            animate={isChecked ? shapeTransforms[2] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.use
            xlinkHref="#shape-04"
            className="shape shape-04 fill-[var(--shape-color-01)] stroke-none"
            animate={isChecked ? shapeTransforms[3] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.use
            xlinkHref="#shape-05"
            className="shape shape-05 fill-none stroke-[var(--shape-color-03)] stroke-3 stroke-linecap-round stroke-linejoin-round"
            animate={isChecked ? shapeTransforms[4] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.use
            xlinkHref="#shape-06"
            className="shape shape-06 fill-none stroke-[var(--shape-color-02)] stroke-3 stroke-linecap-round stroke-linejoin-round"
            animate={isChecked ? shapeTransforms[5] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.use
            xlinkHref="#shape-07"
            className="shape shape-07 fill-none stroke-[var(--shape-color-03)] stroke-3 stroke-linecap-round stroke-linejoin-round"
            animate={isChecked ? shapeTransforms[6] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.use
            xlinkHref="#shape-08"
            className="shape shape-08 fill-[var(--shape-color-01)] stroke-none"
            animate={isChecked ? shapeTransforms[7] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.use
            xlinkHref="#shape-09"
            className="shape shape-09 fill-none stroke-[var(--shape-color-01)] stroke-3 stroke-linecap-round stroke-linejoin-round"
            animate={isChecked ? shapeTransforms[8] : { x: 0, y: 0, rotate: 0 }}
            style={{ transformOrigin: 'center' }}
          />
        </motion.svg>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-01">
            <polygon points="155.77 140.06 141.08 152.42 159.12 158.96 155.77 140.06" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-02">
            <g>
              <line x1="158.66" y1="146.73" x2="141.54" y2="152.29" />
              <line x1="147.32" y1="140.95" x2="152.88" y2="158.07" />
            </g>
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-03">
            <circle cx="150.1" cy="149.51" r="13" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-04">
            <circle cx="150.1" cy="149.51" r="4" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-05">
            <rect x="141.1" y="140.51" width="18" height="18" transform="translate(40.44 -31.76) rotate(13.94)" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-06">
            <g>
              <line x1="158.48" y1="152.78" x2="141.72" y2="146.24" />
              <line x1="153.37" y1="141.13" x2="146.83" y2="157.89" />
            </g>
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-07">
            <rect x="138.1" y="137.51" width="24" height="24" transform="translate(-42.94 62.23) rotate(-20.56)" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-08">
            <circle cx="150.1" cy="149.51" r="4" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" id="shape-09">
            <circle cx="150.1" cy="149.51" r="8" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 22" id="icon-01">
            <path d="M18.29,5.76l-.7-1.37A2.59,2.59,0,0,0,15.29,3H10.71a2.59,2.59,0,0,0-2.3,1.39l-.7,1.37a2.6,2.6,0,0,1-2.3,1.39H3.58A2.57,2.57,0,0,0,1,9.71V20.44A2.57,2.57,0,0,0,3.58,23H22.42A2.57,2.57,0,0,0,25,20.44V9.71a2.57,2.57,0,0,0-2.58-2.56H20.59A2.6,2.6,0,0,1,18.29,5.76Z" transform="translate(0 -2)" />
            <ellipse cx="13" cy="12.99" rx="4.52" ry="4.49" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 22" id="icon-02">
            <line x1="25" y1="12.58" x2="25" y2="9.42" />
            <line x1="21" y1="14.16" x2="21" y2="7.84" />
            <line x1="17" y1="15.74" x2="17" y2="6.26" />
            <line x1="13" y1="21" x2="13" y2="1" />
            <line x1="9" y1="17.32" x2="9" y2="4.68" />
            <line x1="5" y1="13.63" x2="5" y2="8.37" />
            <line x1="1" y1="11.53" x2="1" y2="10.47" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 22" id="icon-03">
            <polygon points="8.08 10 1 21 25 21 18.09 12.66 13.78 17.45 8.08 10" />
            <circle cx="8" cy="4" r="3" />
          </symbol>
        </svg>
      </div>
      <div className="fixed bottom-5 left-5 flex flex-col gap-2">
        <a
          href="https://dribbble.com/shots/9829963-Tooltip-animation"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[30px] opacity-20 scale-[0.8] hover:scale-100 transition-transform duration-300 ease-[cubic-bezier(0.38,-0.12,0.24,1.91)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#EA4C89"
              d="M16 0C7.16703 0 0 7.16703 0 16C0 24.833 7.16703 32 16 32C24.8156 32 32 24.833 32 16C32 7.16703 24.8156 0 16 0ZM26.5683 7.37527C28.4772 9.70065 29.6226 12.6681 29.6573 15.8785C29.2061 15.7918 24.6941 14.872 20.1475 15.4447C20.0434 15.2191 19.9566 14.9761 19.8525 14.7332C19.5748 14.0738 19.2625 13.397 18.9501 12.7549C23.9826 10.7072 26.2733 7.75705 26.5683 7.37527ZM16 2.36009C19.4707 2.36009 22.6464 3.66161 25.0586 5.7961C24.8156 6.14317 22.7505 8.90239 17.8915 10.7245C15.6529 6.61171 13.1714 3.24512 12.7896 2.72451C13.8134 2.48156 14.8894 2.36009 16 2.36009ZM10.1866 3.64425C10.551 4.13015 12.9805 7.5141 15.2538 11.5401C8.86768 13.2408 3.22777 13.2061 2.62039 13.2061C3.50542 8.9718 6.36876 5.44902 10.1866 3.64425ZM2.32538 16.0174C2.32538 15.8785 2.32538 15.7397 2.32538 15.6009C2.9154 15.6182 9.54447 15.705 16.3644 13.6573C16.7636 14.4208 17.128 15.2017 17.4751 15.9826C17.3015 16.0347 17.1106 16.0868 16.9371 16.1388C9.89154 18.4121 6.14317 24.6247 5.8308 25.1453C3.6616 22.7332 2.32538 19.5228 2.32538 16.0174ZM16 29.6746C12.8416 29.6746 9.92625 28.5987 7.61822 26.7939C7.86117 26.2907 10.6377 20.9458 18.3427 18.256C18.3774 18.2386 18.3948 18.2386 18.4295 18.2213C20.3557 23.2017 21.1367 27.3839 21.3449 28.5813C19.6963 29.2928 17.8915 29.6746 16 29.6746ZM23.6182 27.3319C23.4794 26.4989 22.7505 22.5076 20.9631 17.5965C25.2495 16.9197 28.9978 18.0304 29.4664 18.1866C28.8764 21.987 26.6898 25.2668 23.6182 27.3319Z"
            />
          </svg>
        </a>
        <a
          href="https://twitter.com/MilanRaring"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[30px] opacity-20 scale-[0.8] hover:scale-100 transition-transform duration-300 ease-[cubic-bezier(0.38,-0.12,0.24,1.91)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 72 72">
            <path
              fill="black"
              d="M67.812 16.141a26.246 26.246 0 0 1-7.519 2.06 13.134 13.134 0 0 0 5.756-7.244 26.127 26.127 0 0 1-8.313 3.176A13.075 13.075 0 0 0 48.182 10c-7.229 0-13.092 5.861-13.092 13.093 0 1.026.118 2.021.338 2.981-10.885-.548-20.528-5.757-26.987-13.679a13.048 13.048 0 0 0-1.771 6.581c0 4.542 2.312 8.551 5.824 10.898a13.048 13.048 0 0 1-5.93-1.638c-.002.055-.002.11-.002.162 0 6.345 4.513 11.638 10.504 12.84a13.177 13.177 0 0 1-3.449.457c-.846 0-1.667-.078-2.465-.231 1.667 5.2 6.499 8.986 12.23 9.09a26.276 26.276 0 0 1-16.26 5.606A26.21 26.21 0 0 1 4 55.976a37.036 37.036 0 0 0 20.067 5.882c24.083 0 37.251-19.949 37.251-37.249 0-.566-.014-1.134-.039-1.694a26.597 26.597 0 0 0 6.533-6.774z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default TooltipButton;