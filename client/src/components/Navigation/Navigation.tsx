import { Link } from "react-router-dom";
import * as uuid from "uuid";
import ButtonSecondary from '../ButtonSecondary/ButtonSecondary';

interface TodoNavigationProps {
  createNewTodoList: (data: Object) => void;
}

const Navigation: React.FC<TodoNavigationProps> = ({ createNewTodoList }) => {

  const createTodoCallback = () => createNewTodoList({ todoListRows: [{ id: uuid.v4(), text: "", complete: false }] })

  return (
    <nav className="navigation">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <p className="logo">Ubiquiti Checklist App</p>
      </Link>
      <div className='navigation__links' >
        <Link to="/" >
          <ButtonSecondary btnText={'Home'} className={'nav'} />
        </Link>
        <Link to="/lists" >
          <ButtonSecondary btnText={'Lists'} className={'nav'} />
        </Link>
        <ButtonSecondary btnText={'Create List'} className={'nav'} handleSubmit={createTodoCallback} />
      </div>
    </nav>
  );
};

export default Navigation;