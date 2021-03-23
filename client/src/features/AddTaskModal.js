import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createTask } from './tasksSlice'

export function AddTaskModal() {
  const [state, setState] = useState({
    show: false,
    name: '',
    email: '',
    text: ''
  });

  const dispatch = useDispatch();

  const handleClose = () => setState({ show: false });
  const handleShow = () => setState({ show: true });
  const handleSubmit = () => {
    dispatch(createTask(state.name, state.email, state.text));
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Добавить
      </Button>

      <Modal
        show={state.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавить задачу</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите имя"
                value={state.name}
                onChange={e => setState({ ...state, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Укажите email"
                value={state.email}
                onChange={e => setState({ ...state, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Задача</Form.Label>
              <Form.Control
                type="text"
                placeholder="Тестовая задача №1"
                value={state.text}
                onChange={e => setState({ ...state, text: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
