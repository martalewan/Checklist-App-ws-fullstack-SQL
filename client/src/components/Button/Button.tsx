interface ButtonProps {
  handleSubmit: (e: any) => void;
  btnText: string;
  className: string;
};

const Button: React.FC<ButtonProps> = ({ handleSubmit, btnText, className }) => {

  return (
    <>
      <button className={`btn ${className}__btn`} onClick={(e: any) => handleSubmit(e)}>{btnText}</button>
    </>
  );
};

export default Button;