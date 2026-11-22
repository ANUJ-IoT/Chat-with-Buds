import NotFound from "../assets/404_not_found_transparent.png";

export default function NotFoundPage() {
  return (
    <div
      style={{ backgroundImage: `url(${NotFound})` }}
      className="bg-contain bg-fixed bg-no-repeat h-screen w-full bg-center"
    ></div>
  );
}
