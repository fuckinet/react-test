import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { auth } from './loginSlice'

export function LoginModal() {
  const [state, setState] = useState({
    show: false,
    login: '',
    password: ''
  });

  const dispatch = useDispatch();

  const handleClose = () => setState({ show: false });
  const handleShow = () => setState({ show: true });
  const handleSubmit = () => {
    dispatch(auth(state.login, state.password));
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Авторизоваться
      </Button>

      <Modal
        show={state.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Авторизация</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите имя"
                value={state.login}
                onChange={e => setState({ ...state, login: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Укажите пароль"
                value={state.password}
                onChange={e => setState({ ...state, password: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Отправить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
