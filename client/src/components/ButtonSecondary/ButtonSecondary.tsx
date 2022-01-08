interface ButtonSecondaryProps {
  handleSubmit?: (e: React.FormEvent<HTMLButtonElement>) => void;
  btnText: string;
  className: string;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({ handleSubmit, btnText, className }) => {


  return (
    <>
      <button className={`btnSecondary ${className}__btn`} onClick={handleSubmit}>{btnText}</button>
    </>
  );
};

export default ButtonSecondary;