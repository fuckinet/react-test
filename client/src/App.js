import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { connect } from 'react-redux';

import store from './store'
import { AddTaskModal } from './features/AddTaskModal';
import { fetchTasks } from './features/tasksSlice'

const RemotePagination = ({ data, page, sizePerPage, onTableChange, totalSize, onSortChange }) => {
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

  render() {
    const { tasks: list } = this.props;
    const paginationOption = {
      custom: true,
      totalSize: Number(list.total_task_count)
    };
    return (
      <div className="App">
        <h1>Список задач</h1>
        <AddTaskModal />
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
  tasks: state.tasks
});

export default connect(mapStateToProps)(List);
