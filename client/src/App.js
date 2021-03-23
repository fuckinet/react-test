import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { connect } from 'react-redux';

import store from './store'
import { AddTaskModal } from './features/AddTaskModal';
import { LoginModal } from './features/LoginModal';
import { fetchTasks } from './features/tasksSlice'
import { logout } from './features/loginSlice'
import {Button} from "react-bootstrap";

const RemotePagination = ({ data, page, sizePerPage, onTableChange, totalSize, onSortChange, defaultSorted }) => {
  const columns = [
    {
      dataField: 'id',
      text: '#',
      sort: true,
      onSort(field, order) {
        onSortChange(field, order);
      }
    },
    {
      dataField: 'username',
      text: 'Имя',
      sort: true,
      onSort(field, order) {
        onSortChange(field, order);
      }
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
      onSort(field, order) {
        onSortChange(field, order);
      }
    },
    {
      dataField: 'text',
      text: 'Задача'
    },
    {
      dataField: 'status',
      text: 'Статус',
      sort: true,
      onSort(field, order) {
        onSortChange(field, order);
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

  handleTableChange(type, { page }) {
    this.setState({ page });
    store.dispatch(fetchTasks(page, this.state.sort, this.state.sortDirection));
  }

  handleSortChange(sort, sortDirection) {
    this.setState({ sort, sortDirection });
    store.dispatch(fetchTasks(this.state.page, sort, sortDirection));
  }

  handleLogout() {
    store.dispatch(logout);
  }

  render() {
    const { tasks: list, auth } = this.props;
    const paginationOption = {
      custom: true,
      totalSize: Number(list.total_task_count)
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
        </div>)}
        {list && list.tasks && list.tasks.length ? (
          <div className="tasks-list">
            <RemotePagination
              data={ list.tasks }
              page={ this.state.page }
              sizePerPage={ 3 }
              totalSize={ paginationOption.totalSize }
              defaultSorted={ [{
                dataField: this.state.sort,
                order: this.state.sortDirection
              }] }
              onTableChange={ (...args) => this.handleTableChange(...args) }
              onSortChange={ (...args) => this.handleSortChange(...args) }
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
