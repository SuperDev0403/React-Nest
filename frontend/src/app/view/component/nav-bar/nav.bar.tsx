import React, { FunctionComponent, useCallback, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthorizedUserSelector } from '../../../module/auth/auth.selector';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { logoutRequest } from '../../../module/auth/auth.action';
import { getFullName } from '../../../module/user/user.model';
import { IconButton } from '@material-ui/core';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import { AddContactDialog } from '../contact/add.contact';
import Button from '@material-ui/core/Button';
import HiddenJs from '@material-ui/core/Hidden/HiddenJs';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import { UserAvatar } from '../user/user.avatar';
import { EditUserDialog } from '../user/edit.user';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		appBar: {},
		title: {
			color: theme.palette.primary.main,
			fontWeight: 'lighter',
			marginLeft: 15,
			marginTop: '8px',

		},
		logo: {
			height: '32px', marginTop: '5px',
		},

		avatar: {
			width: '46px',
			height: '46px',
			fontSize: '14px',
		},

		userOuterbox: {
			display: 'inline-flex',
			width: '100%',
			justifyContent: 'flex-end',

		},

		userPlusicon: {
			width: '48px',
			height: '48px',
			padding: '0',
			margin: '5px -13px 0 0',

		},

		[theme.breakpoints.down('md')]: {
			userOuterbox: {
				justifyContent: 'flex-end',
			},

		},

		[theme.breakpoints.down('sm')]: {

			title: {

				marginLeft: '5px',
				marginTop: '2px',
				fontSize: '1rem',

			},
			logo: {
				height: '22px', marginTop: '5px',
			},

		},

	}),
);

export const NavBar: FunctionComponent<{
	showAddContact?: boolean,
}> = (props) => {
	const classes = useStyles();
	const authorizedUser = useSelector(getAuthorizedUserSelector);
	const dispatch = useDispatch();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}, [setAnchorEl]);

	const handleClose = useCallback(() => {
		setAnchorEl(null);
	}, [setAnchorEl]);

	const onLogoutClick = useCallback(() => {
		dispatch(logoutRequest());
		handleClose();
	}, [dispatch, handleClose]);

	const onEditProfileClick = useCallback(() => {
		setIsEditProfileDialogOpen(true);
		handleClose();
	}, []);

	const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
	const onAddContactDialogClose = useCallback(() => setIsAddContactDialogOpen(false), [setIsAddContactDialogOpen]);

	const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
	const onEditProfileDialogClose = useCallback(() => setIsEditProfileDialogOpen(false), [setIsEditProfileDialogOpen]);

	return (
		<AppBar position="static" color="default" elevation={0} className={classes.appBar}>
			<Toolbar>
				<Grid container item md={6} xs={7}>
					<Typography>
						<a>
							<img className={classes.logo} src={require('../../../asset/image/airbus-logo.png')}/>
						</a>
					</Typography>
					<Typography variant="h6" className={classes.title}>SkyTECH</Typography>
				</Grid>


				<Grid item md={6} xs={5} container>
					{!!authorizedUser && (
						<div className={classes.userOuterbox}>
							<Button
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleMenu}
								color="primary"
							>
								<UserAvatar
									user={authorizedUser}
									className={classes.avatar}
								/>

								<HiddenJs mdDown={true}>
									&nbsp;&nbsp;
									{getFullName(authorizedUser)}
									&nbsp;&nbsp;
									<KeyboardArrowDownOutlinedIcon/>
								</HiddenJs>
							</Button>

							{!!props.showAddContact && (
								<IconButton
									color="primary"
									onClick={() => setIsAddContactDialogOpen(true)} className={classes.userPlusicon}
								>
									<PersonAddOutlinedIcon/>
								</IconButton>
							)}

							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}
							>
								<MenuItem
									onClick={onEditProfileClick}
								>
									Edit Profile
								</MenuItem>
								<MenuItem
									onClick={onLogoutClick}
								>
									Logout
								</MenuItem>
							</Menu>
						</div>
					)}
				</Grid>

				<AddContactDialog isOpen={isAddContactDialogOpen} onClose={onAddContactDialogClose}/>
				<EditUserDialog isOpen={isEditProfileDialogOpen} onClose={onEditProfileDialogClose}/>
			</Toolbar>
		</AppBar>
	);
};
