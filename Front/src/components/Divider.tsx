interface DividerProps {
  text?: string;
}

const Divider = ({ text = 'O continúa con' }: DividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" style={{ borderColor: '#5a7a9a' }}></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2" style={{
          backgroundColor: '#1a1f2a',
          color: '#b0b2b8'
        }}>{text}</span>
      </div>
    </div>
  );
};

export default Divider;
