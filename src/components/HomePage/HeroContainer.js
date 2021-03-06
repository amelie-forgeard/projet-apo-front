import {
  Box, Button, Container, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import logoclean from '../../assets/images/logoclean.jpg';

function HeroContainer() {
  const styles = {
    paperContainer: {
      minHeight: '60vh',
    },
  };
  return (
    <Container style={styles.paperContainer}>
      <Box textAlign="center">
        <Typography
          paddingTop={10}
          variant="h1"
          sx={{
            fontSize: { xs: '35px' },
          }}
        >
          LE MENAGE DEVIENT UN JEU
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        alignContent="space-between"
        padding={5}
      >
        <Box width={300} padding={5} textAlign="center">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '20px', md: '25px' },
            }}
          >
            CduProps organise un jeu en famille, en couple ou en colocation pour
            s'affronter autour des tâches ménagères et mieux les répartir.
          </Typography>
        </Box>
        <Box
          component="img"
          padding={5}
          sx={{
            maxHeight: { xs: 150, md: 250 },
            maxWidth: { xs: 150, md: 250 },
            textAlign: 'center',
          }}
          alt="logo"
          src={logoclean}
        />
      </Box>
      <Box margin="20px" textAlign="center" paddingBottom={5}>
        <Link
          to="/inscription"
          style={{ textDecoration: 'none', color: '#1ba2ac' }}
        >
          <Button color="primary" variant="contained" size="large">
            Inscrivez vous !
          </Button>
        </Link>
      </Box>
    </Container>
  );
}

export default HeroContainer;
