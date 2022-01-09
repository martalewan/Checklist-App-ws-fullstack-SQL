import RoundedButton from '../RoundedButton/RoundedButton';
import SubtodoListItem from '../SubtodoListItem/SubtodoListItem';
import { TodoItemType } from '../../models/models';
import Modal from 'react-modal';
import ModifySubitemsField from '../ModifySubitemsField/ModifySubitemsField';

interface SubtodoListProps {
  deleteChecklistSubtaskRow: (id: string, e: any) => void;
  updateChecklistRowComplete: (selectedTodo: TodoItemType) => void;
  updateChecklistRowText: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  updateChecklistRowValue:  (selectedTodo: TodoItemType, e: any, type: string) => void;
  onRemoveRow: (id: string, e: any) => void;
  onModifyRow: (id: string, e: any) => void;
  editingTodo: TodoItemType;
  handleAddSubtodoItem: (e: any) => void;
  modifyingRow: string;
  setModifyingRow: (id: string) => void;
  focusTodoItem: TodoItemType;
}

const SubtodoList: React.FC<SubtodoListProps> = ({ editingTodo, updateChecklistRowComplete, updateChecklistRowValue, updateChecklistRowText, deleteChecklistSubtaskRow, onRemoveRow, onModifyRow, handleAddSubtodoItem, modifyingRow, setModifyingRow, focusTodoItem }) => {

  return (
    <>
      <section className='subtodo-wrapper'>
        <article className='subtodo-wrapper__icons' >
          <RoundedButton handleSubmit={handleAddSubtodoItem} btnText={'add'} className='add-subtodo' />
        </article>
        <article className="subtodo-wrapper__subtodo-items">
          {editingTodo.todoListRows?.map(subtodo => (
            <SubtodoListItem
              key={subtodo.id}
              todo={subtodo}
              updateChecklistRowComplete={updateChecklistRowComplete}
              updateChecklistRowText={updateChecklistRowText}
              deleteChecklistSubtaskRow={deleteChecklistSubtaskRow}
              onRemoveRow={onRemoveRow}
              onModify={(e) => onModifyRow(subtodo.id, e)}
            />
          ))}
        </article>
      </section>

      <Modal
        className="Modal"
        overlayClassName="Overlay"
        isOpen={modifyingRow !== ''}
        onRequestClose={() => setModifyingRow('')}
        contentLabel="Modify task"
        ariaHideApp={false}
      > 
      { modifyingRow !== '' 
      ?  <ModifySubitemsField
          todo={focusTodoItem.todoListRows.filter(item => item.id === modifyingRow)[0]}
          updateChecklistRowText={updateChecklistRowText}
          updateChecklistRowValue={updateChecklistRowValue}
        />  
        : <></>}
      </Modal>
    </>
  );
};

export default SubtodoList;