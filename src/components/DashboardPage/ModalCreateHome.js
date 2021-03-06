/* eslint-disable react/no-array-index-key */
import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button, IconButton, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  TextField, Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';

import { addHome } from '../../apis/api/homes';
import authContext from '../../contexts/authContext';
import getGenericTasks from '../../apis/api/generic_tasks';
import addHomeTask from '../../apis/api/home_tasks';
import addInvitation from '../../apis/api/invitation';
import addReward from '../../apis/api/rewards';

const defaultFormData = {
  user_id: null,
  name: '',
  invitations: [''],
  reward: {
    title: '',
    description: '',
  },
};

const initGenericTasks = (genericTasks) => (
  genericTasks.map((genTask, index) => ({ ...genTask, checked: index === 0 }))
);

function ModalCreateHome() {
  const { userData, setUserData } = useContext(authContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(defaultFormData);
  const [genericTasks, setGenericTasks] = useState([]);

  // Fetch genericTasks collection
  useEffect(() => {
    getGenericTasks(
      (resData) => {
        setGenericTasks(initGenericTasks(resData));
      },
      () => {},
    );
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData({ ...defaultFormData });
    setGenericTasks(initGenericTasks(genericTasks));
    setError('');
  };

  const handleFieldChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // wait for home creation
      const { id: homeId } = await addHome({ user_id: userData.id, name: data.name });
      // post each task to api and store an array of promises
      const tasksPromises = genericTasks
        .filter((task) => task.checked)
        .map((task) => addHomeTask({ name: task.name, value: task.value }, homeId));
      // post each invite to api and store an array of promises
      const invitesPromises = data.invitations
        .filter((email) => !!email)
        .map((email) => addInvitation({ email: email }, homeId));
      // TODO Handle empty reward title or description
      // post reward data and store a promise
      const rewardPromise = addReward(data.reward, homeId);
      // wait all promises to be resolved
      await Promise.all([...tasksPromises, ...invitesPromises, rewardPromise]);
      setUserData({ ...userData, home_id: homeId });
      setLoading(false);
      setOpen(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const onSelectTaskHandler = (selectedTask) => () => {
    setGenericTasks(genericTasks.map((genTask) => {
      if (genTask.id === selectedTask.id) {
        return ({ ...genTask, checked: !genTask.checked });
      }
      return genTask;
    }));
  };

  const handleInvitationChange = (modifiedIndex) => (e) => {
    const newInvite = e.target.value;
    const newData = {
      ...data,
      // returns a new invitations array containing the invite just modified by the user
      invitations: data.invitations.map(
        (prevInvite, index) => (modifiedIndex === index ? newInvite : prevInvite),
      ),
    };
    setData(newData);
  };

  const onAddInviteClick = () => {
    const newData = {
      ...data,
      invitations: [...data.invitations, ''],
    };
    setData(newData);
  };

  function handleRewardFieldChange(e) {
    const newData = { ...data };
    newData.reward[e.target.name] = e.target.value;
    setData(newData);
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Ajouter
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <form onSubmit={onSubmitHandler}>
          <DialogTitle>
            Cr??ation de votre maison
          </DialogTitle>
          <DialogContent>
            <DialogContentText marginTop="1rem">
              1. Donnes un nom ?? ta maison
            </DialogContentText>
            <TextField
              autoFocus
              name="name"
              label="Nom de la maison"
              value={data.name}
              onChange={(e) => handleFieldChange(e)}
              fullWidth
              sx={{ marginTop: '1rem' }}
              autoComplete="off"
              required
            />
            <DialogContentText marginTop="3rem">
              2. D??finis la liste de t??ches disponible pour tout le monde
            </DialogContentText>
            <List>
              {genericTasks.map((genTask) => (
                <ListItem
                  key={genTask.id}
                  disablePadding
                  divider
                  secondaryAction={genTask.value}
                >
                  <ListItemButton dense role={undefined} onClick={onSelectTaskHandler(genTask)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={genTask.checked}
                        tabIndex={-1}
                        inputProps={{ 'aria-labelledby': genTask.id }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${genTask.name}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box textAlign="center">
              <Tooltip
                title="Vous pourrez en cr??er plus tard"
                placement="top"
                enterTouchDelay={1}
              >
                <span>
                  <Button
                    variant="text"
                    disabled
                  >
                    Cr??er une t??che
                  </Button>
                </span>
              </Tooltip>
            </Box>
            <DialogContentText marginTop="3rem">
              3. Invites tes proches !
            </DialogContentText>
            <List>
              {data.invitations.map((invite, index) => (
                <ListItem key={index} disablePadding>
                  <TextField
                    autoComplete="off"
                    key={index}
                    name={`invitations[${index}]`}
                    label={`Email ${index + 1}`}
                    value={invite}
                    type="email"
                    onChange={handleInvitationChange(index)}
                    fullWidth
                    sx={{ marginTop: '1rem' }}
                  />
                </ListItem>
              ))}
            </List>
            <IconButton
              variant="contained"
              onClick={onAddInviteClick}
            >
              <AddIcon />
            </IconButton>
            <DialogContentText marginTop="3rem">
              4. D??finis une r??compense si tu le souhaites !
            </DialogContentText>
            <TextField
              required
              name="title"
              label="Nom de la r??compense"
              value={data.reward.title}
              onChange={(e) => handleRewardFieldChange(e)}
              fullWidth
              sx={{ marginTop: '1rem' }}
            />
            <TextField
              required
              name="description"
              label="Description de la r??compense"
              value={data.reward.description}
              onChange={(e) => handleRewardFieldChange(e)}
              fullWidth
              multiline
              sx={{ marginTop: '1rem' }}
            />
            <DialogContentText color="error" marginTop="1rem">
              {error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Revenir ?? la page d'accueil
            </Button>
            <LoadingButton loading={loading} type="submit">
              Valider
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default ModalCreateHome;
