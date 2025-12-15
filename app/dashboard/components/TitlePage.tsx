export default function TitlePage({ title }: { title: string }) {
    return (
        <h1
            className="
                text-sky-700
                text-3xl font-extrabold pb-8
                dark:text-primary
                relative
                after:content-['']
                after:block
                after:w-16
                after:h-0.75
                after:mt-2
                after:bg-sky-700
                dark:after:bg-primary
            "
        >
            {title}
        </h1>
    );
}