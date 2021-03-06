import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    submit: {

        margin: theme.spacing(4, 0, 2),
      },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  form: {
    width: '100%', 
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

}));