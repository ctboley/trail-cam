import React, { useEffect, useState } from 'react';
import AppBar from './AppBar';
import { Box, Card, CardMedia, Grid, makeStyles } from '@material-ui/core';
import { getImages } from '../utils/api';
import Image from '../models/image';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  card: {
    margin: theme.spacing(1),
  },
}));

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getImages('2020-12-24T00:00:00.000Z', 10, 0, 'desc').then((imgs) => {
      const images = imgs.data.map((img) => new Image(img));
      setImages(images);
    });
  }, []);

  return (
    <Box>
      <AppBar title="Trail Camera" />
      <Box className={classes.root}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          {images.map((img, i) => (
            <Grid key={i} item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardMedia component="img" height="auto" image={img.url} title={img.id} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
