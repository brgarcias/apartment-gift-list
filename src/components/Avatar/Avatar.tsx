"use client";

const InitialsAvatar = ({
  name,
  size = 128,
}: {
  name: string;
  size?: number;
}) => {
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  };

  const generateColor = (initials: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    const charCodeSum = initials
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const initials = getInitials(name);
  const colorClass = generateColor(initials);

  return (
    <div
      className={`${colorClass} rounded-full flex items-center justify-center text-white font-normal`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2.5}px`,
      }}
    >
      {initials}
    </div>
  );
};

export default InitialsAvatar;
