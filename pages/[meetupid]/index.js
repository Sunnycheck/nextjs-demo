import { Fragment } from "react";
import Head from "next/head";
import classes from "./MeetupDetails.module.css";
import { MongoClient, ObjectId } from "mongodb";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
      <title>{props.meetupData.title}</title>
        <meta name= 'description' content={props.meetupData.description}/>
      </Head>

      <section className={classes.detail}>
        <img src={props.meetupData.image} />
        <h1>{props.meetupData.title}</h1>
        <address>{props.meetupData.address}</address>
        <p>{props.meetupData.description}</p>
      </section>
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://root:1234554321@cluster0.utdk2bs.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupid: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  //fetch data for single meetup
  const meetupid = context.params.meetupid;

  const client = await MongoClient.connect(
    "mongodb+srv://root:1234554321@cluster0.utdk2bs.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupid),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}
export default MeetupDetails;
