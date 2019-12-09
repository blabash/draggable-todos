import React from 'react';
import PropTypes from 'prop-types';

const POSITION = { x: 0, y: 0 };

const Draggable = ({ children, id, onDrag, onDragEnd }) => {
  const [state, setState] = React.useState({
    isDragging: false,
    origin: POSITION,
    translation: POSITION
  });

  const handleMouseDown = React.useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      isDragging: true,
      origin: { x: clientX, y: clientY }
    }));
  }, []);

  const handleMouseMove = React.useCallback(
    ({ clientX, clientY }) => {
      const translation = {
        x: clientX - state.origin.x,
        y: clientY - state.origin.y
      };

      setState(state => ({
        ...state,
        translation
      }));

      onDrag({ translation, id });
    },
    [state.origin, onDrag, id]
  );

  const handleMouseUp = React.useCallback(() => {
    setState(state => ({
      ...state,
      isDragging: false
    }));

    onDragEnd();
  }, [onDragEnd]);

  React.useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      setState(state => ({ ...state, translation: { x: 0, y: 0 } }));
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  const styles = React.useMemo(
    () => ({
      cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
      transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
      transition: state.isDragging ? 'none' : 'transform 500ms',
      zIndex: state.isDragging ? 2 : 1,
      position: state.isDragging ? 'absolute' : 'relative'
    }),
    [state.isDragging, state.translation]
  );

  return (
    <div style={styles} onMouseDown={handleMouseDown}>
      {children}
    </div>
  );
};

Draggable.propTypes = {};

export default Draggable;
