import iconAdd from '../../img/icon-add.svg';
import iconModify from '../../img/icon-open-white.svg';
import iconDelete from '../../img/icon-delete.svg';

interface RoundedButtonProps {
  handleSubmit?: (e: React.FormEvent<HTMLButtonElement>) => void;
  btnText: string;
  className: string;
}

const RoundedButton: React.FC<RoundedButtonProps> = ({ handleSubmit, btnText, className }) => {

  const displayIcon = (btnText: string) => {
    if (btnText === 'modify') {
      return iconModify;
    } else if (btnText === 'add') {
      return iconAdd;
    } else {return iconDelete; }
  }

  return (
    <>
      <button className={`rounded-btn ${className}__btn`} onClick={handleSubmit}>
        <img className="img-icons icon-open" src={displayIcon(btnText)} alt="" />    
      </button>
    </>
  );
}

export default RoundedButton;