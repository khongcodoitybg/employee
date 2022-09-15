import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';

import {
	Grid,
	TextField,
	ButtonGroup,
	Button,
	IconButton,
	Icon,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { Breadcrumb, ConfirmationDialog } from 'egret';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import EmployeeEditorDialog from './EmployeeEditorDialog';
import { searchByDto, deleteEmployee } from './EmployeeService';
import { toast } from 'react-toastify';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

toast.configure({
	autoClose: 1000,
	draggable: false,
	limit: 3,
});

const LightTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
		position: 'absolute',
		top: '-15px',
		left: '-30px',
		width: '80px',
	},
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
	box: {
		display: 'flex',
		margin: '5px 0',
		alignItems: 'space-evenly',
		padding: theme.spacing(1),
	},

	groupButton: {
		marginLeft: 10,
		marginTop: 20,
		display: 'flex',
		justifyContent: 'end',
	},
	search: {
		width: '25%',
		marginLeft: 'auto',
	},
	button1: {
		marginLeft: 5,
	},
	dialogContentText: {
		marginBottom: 20,
	},
	textField: {
		margin: theme.spacing(1),
	},
	dialogTitle: {
		marginBottom: 10,
	},
	buttonEdit: {
		'&:hover': { backgroundColor: '#ff9e43c2 !important' },
	},
}));

function Employee() {
	const classes = useStyles();
	const { t, i18n } = useTranslation();

	const [itemList, setItemList] = useState([]);
	const [state, setState] = useState(true);
	const [open, setOpen] = useState(false);
	const [deleteButton, setDeleteButton] = useState(false);
	const [submit, setSubmit] = useState(false);
	const [search, setSearch] = useState('');
	const [oldUser, setOldUser] = useState({});

	const columns = [
		{
			title: 'Thao tác',
			field: '',
			render: (rowData) => (
				<>
					<LightTooltip
						title={t('general.editIcon')}
						placement="right-end"
						enterDelay={300}
						leaveDelay={200}>
						<IconButton
							size="small"
							onClick={() => {
								handleEdit(rowData);
							}}>
							<Icon
								fontSize="small"
								color="primary">
								edit
							</Icon>
						</IconButton>
					</LightTooltip>
					<LightTooltip
						title={t('general.deleteIcon')}
						placement="right-end"
						enterDelay={300}
						leaveDelay={200}>
						<IconButton
							size="small"
							onClick={() => {
								handleOpenDelete(rowData);
							}}>
							<Icon
								fontSize="small"
								color="error">
								delete
							</Icon>
						</IconButton>
					</LightTooltip>
				</>
			),
		},
		{ title: 'Tên', field: 'name' },
		{ title: 'Code', field: 'code' },
		{ title: 'Tuổi', field: 'age' },
		{ title: 'Email', field: 'email' },
		{ title: 'Điện thoại', field: 'phone' },
	];

	useEffect(() => {
		searchByDto({}).then((res) => {
			setItemList(res.data.data);
		});
	}, [state]);
	useEffect(() => {
		searchByDto({}).then((res) => {
			setItemList(res.data.data.filter((employee) => handleSearch(employee)));
		});
	}, [search]);

	//Render
	const reRender = () => {
		searchByDto({}).then((res) => {
			setItemList(res.data.data);
		});
	};

	const handleSearch = (employee) => {
		if (search === '') {
			return employee;
		} else {
			if (search !== '') {
				let keySearch = search.toLowerCase();
				if (
					employee.name.toLowerCase().includes(keySearch) ||
					employee.email.toLowerCase().includes(keySearch) ||
					employee.code.toLowerCase().includes(keySearch)
				) {
					return employee;
				}
			}
		}
	};

	//edit
	const handleOpen = () => {
		setOpen(true);
		setOldUser({});
	};

	const handleClose = () => {
		setOpen(false);
		setOldUser({});
	};

	//delete

	const handleClose__Delete = () => {
		setDeleteButton(false);
	};

	const handleOpenDelete = (rowData) => {
		setDeleteButton(true);
		setOldUser(rowData);
	};

	const handleDeleteEmployee = (data) => {
		setOldUser(data);
		deleteEmployee(data).then(() => {
			reRender();
			handleClose__Delete();
			toast.success('Xóa thành công');
		});
	};

	// edit
	const handleEdit = (rowData) => {
		setOpen(true);
		setOldUser(rowData);
	};

	const handleSubmit = (
		name,
		age,
		code,
		email,
		phone,
		province,
		district,
		commune
	) => {};

	return (
		<div className="m-sm-30">
			<EmployeeEditorDialog
				employeeData={oldUser}
				setstate={setState}
				state={state}
				handleClose={handleClose}
				submit={submit}
				open={open}
				setOpen={setOpen}
				reRender={reRender}
				setSubmit={setSubmit}
				setHandleSubmit={(
					name,
					age,
					code,
					email,
					phone,
					province,
					district,
					commune
				) =>
					handleSubmit(
						name,
						age,
						code,
						email,
						phone,
						province,
						district,
						commune
					)
				}
			/>

			<Grid className={classes.box}>
				<Helmet>
					<title>Quản lý nhân viên</title>
				</Helmet>
				<div>
					<Breadcrumb
						routeSegments={[
							{ name: 'Danh mục', path: '/directory/apartment' },
							{ name: 'Nhân viên' },
						]}
					/>
				</div>
			</Grid>

			<Grid className={classes.box}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleOpen}>
					Thêm mới
					<PersonAddIcon className={classes.button1} />
				</Button>

				{/* Search Input */}
				<Grid className={classes.search}>
					<TextField
						label="Search"
						type="text"
						fullWidth
						value={search}
						onChange={(e) => {
							e.preventDefault();
							setSearch(e.target.value);
						}}
						InputProps={{
							startAdornment: <SearchIcon />,
						}}
					/>
				</Grid>
			</Grid>

			<Grid>
				<ConfirmationDialog
					open={deleteButton}
					onConfirmDialogClose={handleClose__Delete}
					onYesClick={() => {
						handleDeleteEmployee(oldUser);
					}}
					text={`Bạn có chắc muốn xóa "${oldUser.name}"?`}
					title="Xác nhận"
					No={'Không'}
					Yes={'Đồng ý'}
				/>
			</Grid>

			<Grid xs={12}>
				<MaterialTable
					title={'Danh sách nhân viên'}
					data={itemList}
					columns={columns}
					options={{
						selection: false,
						paging: true,
						search: false,
						exportButton: true,

						rowStyle: (rowData, index) => ({
							backgroundColor: index % 2 === 1 ? '#EEE' : '#FFF',
						}),
						headerStyle: {
							backgroundColor: '#358600',
							color: '#fff',
						},
						padding: 'dense',
						toolbar: true,
					}}
					localization={{
						body: {
							emptyDataSourceMessage: 'No data',
						},
					}}
				/>
			</Grid>
		</div>
	);
}

export default Employee;
