import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";
import { Fragment } from "react";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>Meetup React/Next js training page</title>
        <meta name= 'description' content="Page made passing React course of C.Schwarzmuller "/>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
// const req = context.req;
// const res = context.res;

//   //fetch data from api/database
//   return {
//     props: {
//       meetups: Dummy_Meetups

//     }
//   };
// };
export async function getStaticProps() {
  //fetch data from api/database
  const client = await MongoClient.connect(
    "mongodb+srv://root:1234554321@cluster0.utdk2bs.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}
export default HomePage;
