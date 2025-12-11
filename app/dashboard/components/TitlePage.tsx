export default function TitlePage({ title }: { title: string }) {
    return (
        <h1
            className="
                text-3xl font-extrabold text-primary pb-8
                relative
                after:content-['']
                after:block
                after:w-16
                after:h-[3px]
                after:mt-2
                after:bg-primary
            "
        >
            {title}
        </h1>
    );
}