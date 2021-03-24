import React, { Component } from 'react';
import { Alert, Button } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Type } from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';

import store from './store'
import { AddTaskModal } from './features/AddTaskModal';
import { LoginModal } from './features/LoginModal';
import { fetchTasks, updateTask } from './features/tasksSlice'
import { logout } from './features/loginSlice'

const RemotePagination = ({ isAuth, data, page, sizePerPage, onTableChange, totalSize, defaultSorted }) => {
  const statusesOptions = [
    {
      value: 0,
      label: 'Не выполнена'
    }, {
      value: 1,
      label: 'Не выполнена, отредактирована админом'
    }, {
      value: 10,
      label: 'Выполнена'
    }, {
      value: 11,
      label: 'Задача отредактирована админом и выполнена'
    }
  ];
  const columns = [
    {
      dataField: 'id',
      text: '#',
      sort: true,
      editable: false
    },
    {
      dataField: 'username',
      text: 'Имя',
      sort: true,
      editable: false
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
      editable: false
    },
    {
      dataField: 'text',
      text: 'Задача',
      editable: isAuth
    },
    {
      dataField: 'status',
      text: 'Статус',
      sort: true,
      editable: isAuth,
      formatter(cell) {
        const status = statusesOptions.find(({value}) => value === parseInt(cell, 10));
        return status ? status.label : '#err#';
      },
      editor: {
        type: Type.SELECT,
        options: statusesOptions
      }
    }
  ];
  return (
    <div>
      <BootstrapTable
        remote
        keyField="id"
        data={ data }
        columns={ columns }
        defaultSorted={ defaultSorted }
        pagination={ paginationFactory({
          page, sizePerPage, totalSize, sizePerPageList: []
        })}
        cellEdit={ cellEditFactory({ mode: 'click' }) }
        onTableChange={ onTableChange }
      />
    </div>
  );
};

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      sort: 'id',
      sortDirection: 'desc'
    }
  }

  componentDidMount() {
    store.dispatch(fetchTasks(this.state.page, this.state.sort, this.state.sortDirection));
  }

  handleTableChange(type, data) {
    if (type === 'sort') {
      const { sortField, sortOrder } = data;
      this.setState({ sort: sortField, sortDirection: sortOrder });
      store.dispatch(fetchTasks(this.state.page, sortField, sortOrder));
    }
    else if (type === 'pagination') {
      const { page } = data;
      this.setState({ page });
      store.dispatch(fetchTasks(page, this.state.sort, this.state.sortDirection));
    }
    else if (type === 'cellEdit') {
      const { cellEdit } = data;
      if (cellEdit.dataField === 'text') {
        store.dispatch(updateTask(cellEdit.rowId, cellEdit.dataField, cellEdit.newValue));
      }
      else if (cellEdit.dataField === 'status') {
        store.dispatch(updateTask(cellEdit.rowId, cellEdit.dataField, parseInt(cellEdit.newValue, 10)));
      }
    }
  }

  handleLogout() {
    store.dispatch(logout);
  }

  render() {
    const { tasks: list, auth } = this.props;
    const paginationOption = {
      custom: true,
      totalSize: parseInt(list.total_task_count, 10)
    };
    return (
      <div className="App">
        <h1>Список задач</h1>
        <div className="nav-buttons">
          <AddTaskModal />
        </div>
        {!auth.token ? (<div className="nav-buttons">
          <LoginModal />
        </div>) : (<div className="nav-buttons">
          <Button variant="danger" onClick={this.handleLogout}>
            Выйти
          </Button>
          <Alert variant="success">
            <Alert.Heading>Вы авторизованы как администратор!</Alert.Heading>
            <p>
              Для редактирования задачи, нажмите на нужную ячейку таблицы ниже и для сохранения сделанных изменений, подтвердите нажатием клавиищи `ENTER`.
            </p>
          </Alert>
        </div>)}
        {list && list.tasks && list.tasks.length ? (
          <div className="tasks-list">
            <RemotePagination
              data={ list.tasks }
              page={ this.state.page }
              sizePerPage={ 3 }
              totalSize={ paginationOption.totalSize }
              isAuth={ !!auth.token }
              defaultSorted={ [{
                dataField: this.state.sort,
                order: this.state.sortDirection
              }] }
              onTableChange={ (...args) => this.handleTableChange(...args) }
            />
          </div>
        ) : (
          <div>
            <h2>Ничего не найдено!</h2>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tasks: state.tasks,
  auth: state.auth
});

export default connect(mapStateToProps)(List);
