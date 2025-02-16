import { MetaFunction } from "@remix-run/node";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { Card, Carousel } from "~/components/ui/blog-cards-carousel";

export const meta : MetaFunction = () => [
  {
    title: "Our Mission and Values | About KCB Reports",
    description: "Welcome to KCB Reports!",
  },
];

interface ProfileCardProps {
  img: string;
  name: string;
  role: string;
}

interface User {
  name: string;
  image: string;
}

interface BlogCardProps {
  id: string;
  blog_Img: string;
  topics: string[];
  timePosted: string;
  user: User;
  title: string;
}

interface BadgeProps {
  text: string;
}

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Get to know your iSad.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <img
              src="https://ui.aceternity.com/_next/image?url=https%3A%2F%2Fassets.aceternity.com%2Fmacbook.png&w=640&q=75"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

export const Badge = ({ text }: BadgeProps) => (
  <div className="no-underline group cursor-pointer relative shadow-2xl shadow-zinc-500 rounded-full p-px py-0.5 text-xs font-semibold leading-6 text-white inline-block">
    <div className="relative flex space-x-2 items-center z-10 rounded-full px-2 ring-1 ring-white/60">
      <span>{text}</span>
    </div>
  </div>
);

const ProfileCard = ({ img, name, role }: ProfileCardProps) => (
  <div className="px-3 py-2.5 flex flex-col justify-center items-center gap-2">
    <img src={img} alt={name} className="w-24 h-24 rounded-full bg-amber-200" />
    <span className="font-semibold text-black text-base dark:text-white mt-4 text-center">
      {name}
    </span>
    <span className="font-normal text-slate-600 text-sm dark:text-slate-200 text-center">
      {role}
    </span>
  </div>
);

const BlogCard = ({
  id,
  blog_Img,
  topics,
  timePosted,
  user,
  title,
}: BlogCardProps) => {
  const { name, image } = user;
  return (
    <div
      className="h-[32rem] w-full rounded-lg relative overflow-hidden"
      id={id}
    >
      <img
        src={blog_Img}
        alt={title}
        className="w-full h-full bg-amber-100 dark:bg-amber-500 rounded-xl"
      />
      <div className="w-full h-[65%] px-6 pt-40 flex flex-col justify-center absolute bottom-0 rounded-b-lg bg-gradient-to-b from-transparent dark:to-slate-800/40 to-slate-600/40 to-70%">
        <div className="w-full flex items-center mb-2 gap-2 overflow-x-auto">
          {topics.map((topic, index) => (
            <Badge key={index} text={topic} />
          ))}
        </div>
        <span className="text-zinc-100 text-sm">{timePosted}</span>
        <div className="w-full flex gap-4 items-center">
          <span className="w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-full">
            {image}
          </span>
          <span className="text-slate-100">{name}</span>
        </div>
        <div className="font-semibold text-lg text-white">{title}</div>
      </div>
    </div>
  );
};

const data = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "",
    content: <DummyContent />,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "",// "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Launching the new Apple Vision Pro.",
    src: "", //"https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },

  {
    category: "Product",
    title: "Maps for your iPhone 15 Pro Max.",
    src: "", //"https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "", //"https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "Hiring for a Staff Software Engineer",
    src: "", //"https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];

const About = () => {
  const teamMembers = [
    { img: "", name: "Egesa Raymond", role: "" },
    { img: "", name: "Mwesigwa Trevor", role: "" },
    { img: "", name: "Ochepa Elisha", role: "" },
  ];

  const blogs = [
    {
      id: uuidv4(),
      blog_Img: "",
      topics: ["Design", "Technology", "Presentations"],
      timePosted: "Mar 10, 2024",
      user: { name: "Lindsy Walton", image: "L" },
      title: "Libero quisquam volunpata tisus namo.",
    },
    {
      id: uuidv4(),
      blog_Img: "",
      topics: ["Design", "Documentations", "Presentations"],
      timePosted: "Jun 15, 2024",
      user: { name: "Bella Anderson", image: "B" },
      title: "Libero quisquam volunpata tisus namo.",
    },
    {
      id: uuidv4(),
      blog_Img: "",
      topics: ["Technology", "Presentations"],
      timePosted: "Nov 10, 2024",
      user: { name: "William Waters", image: "W" },
      title: "Libero quisquam volunpata tisus namo.",
    },
  ];

  return (
    <div
      className="bg-white text-black dark:bg-slate-900
 dark:text-white sm:relative"
    >
      <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8 sm:w-[60%]">
        <div className="mx-auto max-w-4xl text-center sm:text-left sm:mx-0 sm:px-10">
          <h2 className="text-base font-semibold text-green-600 dark:text-green-400">
            About
          </h2>
          <p
            className="mt-2 text-5xl font-semibold text-gray-500
 dark:text-zinc-100"
          >
            Redefining school reports and empowering the future of reporting
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-200 sm:mx-0 sm:px-10">
          KCB Reports is a dynamic reporting system designed to simplify report
          creation and enhance academic progress analysis for teachers, parents,
          and school administrators.
        </p>
      </div>
      <div className="w-full min-h-screen mt-14 flex items-center justify-center sm:min-h-[40vh] sm:h-[85vh] sm:absolute sm:-top-[1.5%] sm:right-[2.5%] sm:w-[37%]">
        <div className="relative w-full h-full grid grid-cols-1 sm:grid-cols-4 gap-6 px-6 sm:px-12 overflow-hidden">
          {/* Card Image 1 */}
          <div className="h-[17.5rem] w-[12rem] sm:w-[176px] rounded-2xl shadow bg-amber-100 dark:bg-amber-500 flex items-center justify-center sm:absolute sm:translate-x-0 sm:-translate-y-5">
            Card 1
          </div>

          {/* Card Image 2 */}
          <div
            className="h-[17.5rem] w-[12rem] sm:w-[176px] rounded-2xl shadow bg-teal-100 dark:bg-teal-500
 flex items-center justify-center sm:absolute sm:translate-x-0 sm:translate-y-[110%]"
          >
            Card 2
          </div>

          {/* Card Image 3 */}
          <div
            className="h-[17.5rem] w-[12rem] sm:w-[176px] rounded-2xl shadow bg-fuchsia-100 dark:bg-fuchsia-500
 flex items-center justify-center sm:absolute sm:translate-x-[110%] sm:translate-y-1/2"
          >
            Card 3
          </div>

          {/* Card Image 4 */}
          <div
            className="h-[17.5rem] w-[12rem] sm:w-[176px] rounded-2xl shadow bg-rose-100 dark:bg-rose-500
 flex items-center justify-center sm:absolute sm:translate-x-[220%] sm:-translate-y-5"
          >
            Card 4
          </div>

          {/* Card Image 5 */}
          <div
            className="h-[17.5rem] w-[12rem] sm:w-[176px] rounded-2xl shadow bg-fuchsia-100 dark:fuchsia-500
 flex items-center justify-center sm:absolute sm:translate-x-[220%] sm:translate-y-[110%]"
          >
            Card 5
          </div>
        </div>
      </div>

      {/* Our mission */}
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto mt-16">
          <h2
            className="text-balance text-5xl font-semibold tracking-tight text-gray-500
 text-left sm:text-6xl dark:text-zinc-100"
          >
            Our mission
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 dark:text-gray-200 sm:mx-0">
            To change the way parents, teachers and administrators interact with
            their students' reports and progress to give a better feedback for a
            more conductive and condusive response and action for their
            students, inorder for a better outcome and performance.
          </p>
        </div>
      </div>
      <div className="sm:px-6">
        <div
          className="w-full h-40 bg-cyan-100 dark:bg-cyan-500
 mt-12 sm:h-80 sm:rounded-md"
        ></div>
      </div>

      {/* Our Values */}
      <div className="px-6 py-24 sm:py-32 lg:px-8 mt-8">
        <div className="mx-auto mt-16">
          <h2
            className="text-balance text-5xl font-semibold tracking-tight text-gray-500
 text-left sm:text-6xl dark:text-zinc-100"
          >
            Our values
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-xl/8 sm:mx-0 dark:text-gray-200">
            Our values are clear, simple and easy to grasp in adherence of
            delivering the best services and customer care.
          </p>
        </div>
        <div className="mx-auto mt-16 sm:grid sm:grid-cols-3 gap-4">
          {/* Value 1 */}
          <div className="mt-8 sm:mt-16">
            <h2
              className="text-balance text-lg font-semibold tracking-tight text-gray-500
 sm:text-xl dark:text-zinc-100"
            >
              Be constructive and innovative
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-lg dark:text-gray-200">
              Constructivity and innovation brings one the ability to build and
              implement <b> "out of the box" </b> ideas and makes problem
              solving easier hence speeding planning, development, and service
              deliverance.
            </p>
          </div>
          {/* Value 2 */}
          <div className="mt-16">
            <h2
              className="text-balance text-lg font-semibold tracking-tight text-gray-500
 text-left sm:text-xl dark:text-zinc-100"
            >
              Be just and transparent
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-lg dark:text-gray-200">
              Justification and transparency is paramount to our team's
              understanding and customer privacy protection and priotization.
              This helps us to create and protect a rightful image to the
              public.
            </p>
          </div>
          {/* Value 3 */}
          <div className="mt-16">
            <h2
              className="text-balance text-lg font-semibold tracking-tight text-gray-500
 text-left sm:text-xl dark:text-zinc-100"
            >
              Always ready to learn
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-lg dark:text-gray-200">
              Learning never ends but always has new things to keep us updated.
              Learning from circumstances like service clarity, customer
              feedback, development processing, which brings us close to
              customer and developer expectations and wants.
            </p>
          </div>
          {/* Value 4 */}
          <div className="mt-16">
            <h2
              className="text-balance text-lg font-semibold tracking-tight text-gray-500
 text-left sm:text-xl dark:text-zinc-100"
            >
              Togetherness solves but solitude doesn't
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-lg dark:text-gray-200">
              Working together is the best solution for higher, further and
              faster development and implementiton therefore giving a better
              thrust for self and project improvement.
            </p>
          </div>
          {/* Value 5 */}
          <div className="mt-16">
            <h2
              className="text-balance text-lg font-semibold tracking-tight text-gray-500
 text-left sm:text-xl dark:text-zinc-100"
            >
              Be clear and concise
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-lg dark:text-gray-200">
              Our team strives to be clear and concise about any small press
              talks or presentations on product showcasing and customer
              interactions. This helps everyone to know what we want to archive.
            </p>
          </div>
          {/*  */}
          <div className="mt-16">
            <h2
              className="text-balance text-lg font-semibold tracking-tight text-gray-500
 text-left sm:text-xl dark:text-zinc-100"
            >
              Be constructive and innovative
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-left text-lg font-normal text-gray-600 sm:text-lg dark:text-gray-200">
              Constructivity and innovation brings one the ability to build and
              implement <b> "out of the box" </b> ideas and makes problem
              solving easier.
            </p>
          </div>
        </div>
      </div>
      {/* Our Team */}
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <h2
          className="text-5xl font-semibold text-gray-500
 dark:text-zinc-100 sm:mb-4"
        >
          Our Team
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6 sm:mt-10">
          {teamMembers.map((teamMember, index) => (
            <ProfileCard
              key={index}
              img={teamMember.img}
              name={teamMember.name}
              role={teamMember.role}
            />
          ))}
        </div>
      </div>
      {/* From the Blog */}
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <h2
          className="text-5xl font-semibold text-gray-500
 dark:text-zinc-100"
        >
          From the Blog
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      </div>
      <AppleCardsCarouselDemo />
    </div>
  );
};

export default About;
