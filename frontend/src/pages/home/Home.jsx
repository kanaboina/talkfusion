import { Rnd } from "react-rnd";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<Rnd
			default={{
				x: Math.max((window.innerWidth - 800) / 2, 0),
				y: Math.max((window.innerHeight - 550) / 2, 0),
				width: Math.min(800, window.innerWidth),
				height: Math.min(550, window.innerHeight),
			}}
			minWidth={350}
			minHeight={400}
			bounds="window"
			dragHandleClassName="drag-handle"
			className="z-20"
		>
			<div className='flex h-full w-full rounded-lg shadow-lg overflow-hidden bg-blue-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
				<div className="absolute top-0 left-0 w-full h-8 cursor-move drag-handle z-50 flex items-center justify-center text-white/50 text-xs font-semibold tracking-wider hover:bg-black/20 transition-colors bg-black/40">
					⋮⋮ DRAG TO MOVE ⋮⋮
				</div>
				<div className="flex w-full h-full pt-8">
					<Sidebar />
					<MessageContainer />
				</div>
			</div>
		</Rnd>
	);
};
export default Home;